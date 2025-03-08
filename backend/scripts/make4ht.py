#!/usr/bin/env python3
import subprocess
import sys
import os
import re

def run_make4ht(input_file, workdir):
    """
    Run make4ht to convert the LaTeX file to HTML.
    This command uses the html5 format (which generates an HTML and a CSS file).
    """
    cmd = ["make4ht", input_file]
    try:
        subprocess.run(cmd, check=True, cwd=workdir)
    except subprocess.CalledProcessError as e:
        print("Error during make4ht conversion:", e)
        sys.exit(1)

def inline_css(html_file, css_file):
    """
    Reads the CSS file and inserts it into the HTML file's <head> as an inline <style> tag.
    Also removes the <link> tag referencing the external CSS.
    """
    if not os.path.exists(css_file):
        print(f"CSS file {css_file} not found, skipping inlining.")
        return

    # Read the CSS content
    with open(css_file, "r", encoding="utf-8") as f:
        css_content = f.read()

    # Read the HTML content
    with open(html_file, "r", encoding="utf-8") as f:
        html_content = f.read()

    # Create a style tag with the CSS content
    style_tag = f"<style>\n{css_content}\n</style>\n"

    # Insert the style tag before the closing </head> tag.
    new_html = re.sub(r"(</head\s*>)", style_tag + r"\1", html_content, flags=re.IGNORECASE)

    # Remove any <link> tag that references the CSS file (by file name)
    css_basename = os.path.basename(css_file)
    new_html = re.sub(
        r'<link[^>]*href\s*=\s*["\'][^"\']*' + re.escape(css_basename) + r'["\'][^>]*>',
        "",
        new_html,
        flags=re.IGNORECASE
    )

    # Write the modified HTML back to the file
    with open(html_file, "w", encoding="utf-8") as f:
        f.write(new_html)
    print(f"Inlined CSS into {html_file}")

def cleanup_files(files):
    """
    Delete the list of files.
    """
    for file in files:
        if os.path.exists(file):
            os.remove(file)
            print(f"Deleted {file}")

def convert_latex_to_html(input_file, output_html, workdir = None):
    """
    Converts the given LaTeX file to a single HTML file with inline CSS.
    After conversion, the original LaTeX and extra CSS file are removed.
    """
    if workdir is None:
        workdir = os.path.dirname(input_file)

    # Run make4ht to produce HTML (and CSS)
    run_make4ht(input_file, workdir)

    # By default, make4ht produces an HTML file with the same base name as the input.
    base_name = os.path.splitext(os.path.basename(input_file))[0]
    generated_html = os.path.join(workdir, base_name + '.html')
    generated_css = os.path.join(workdir, base_name + '.css')

    # Inline the CSS into the HTML file.
    inline_css(generated_html, generated_css)

    # Rename the generated HTML file if a different output name is desired.
    if generated_html != output_html:
        os.rename(generated_html, output_html)
        print(f"Renamed {generated_html} to {output_html}")
    else:
        output_html = generated_html

    # Cleanup: delete the original LaTeX and CSS file.
    cleanup_files([input_file, generated_css])

    return generated_html