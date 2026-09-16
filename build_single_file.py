import os
import base64

project_dir = r"C:\Users\Shiva\.gemini\antigravity\scratch\apology-birthday-app"

html_path = os.path.join(project_dir, "index.html")
css_path = os.path.join(project_dir, "style.css")
js_path = os.path.join(project_dir, "script.js")
out_path = os.path.join(project_dir, "apology_for_abby_phone.html")

with open(html_path, "r", encoding="utf-8") as f:
    html = f.read()

with open(css_path, "r", encoding="utf-8") as f:
    css = f.read()

with open(js_path, "r", encoding="utf-8") as f:
    js = f.read()

# Base64 encode all 5 photo images
for i in range(1, 6):
    img_rel = f"assets/images/photo{i}.jpg"
    img_full = os.path.join(project_dir, img_rel)
    if os.path.exists(img_full):
        with open(img_full, "rb") as img_file:
            b64_str = base64.b64encode(img_file.read()).decode("utf-8")
            data_url = f"data:image/jpeg;base64,{b64_str}"
            html = html.replace(img_rel, data_url)

# Replace <link rel="stylesheet" href="style.css"> with inline <style>
html = html.replace('<link rel="stylesheet" href="style.css">', f'<style>\n{css}\n</style>')

# Replace <script src="script.js"></script> with inline <script>
html = html.replace('<script src="script.js"></script>', f'<script>\n{js}\n</script>')

with open(out_path, "w", encoding="utf-8") as f:
    f.write(html)

print(f"Successfully generated single file bundle: {out_path} ({os.path.getsize(out_path)} bytes)")
