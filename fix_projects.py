import re

file_path = "c:\\my projects\\html\\projects.html"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# We need to find the PROJECTS_DATA array.
start_idx = content.find("const PROJECTS_DATA = [")
if start_idx == -1:
    print("Could not find start of PROJECTS_DATA")
    exit(1)

end_idx = content.find("];", start_idx)

projects_data_str = content[start_idx:end_idx]

# Split into object blocks roughly?
# A safer way: find all patterns of image: "...", \s* gallery: [\s* "..." ...]
# Since we just want to replace the `image` with the FIRST item in `gallery`, and then REMOVE the first item in `gallery`.

pattern = re.compile(
    r'(?P<pre>image:\s*"(.*?)",\s*gallery:\s*\[\s*)'
    r'"(?P<first_img>[^"]+)"'
    r'(?P<post>,?)'
    r'(?P<rest>.*?)'
    r'(?P<end>\])',
    re.DOTALL
)

def replacer(match):
    pre = match.group("pre")
    first_img = match.group("first_img")
    post = match.group("post")
    rest = match.group("rest")
    end = match.group("end")
    
    # Check if this gallery only has 1 image. If so, leave the gallery empty.
    # The prompt: "in each project show the 1st iamge front and same this image not show in galarry"
    # Actually, we need to replace the image: "..." part.
    # `pre` contains `image: "old_img",\n gallery: [\n `
    
    # We can rebuild the block:
    # We replace `image: "old_img"` with `image: "first_img"`
    
    new_pre = re.sub(r'image:\s*".*?"', f'image: "{first_img}"', pre, count=1)
    
    # If the gallery has only one item (post == "" and rest spaces), the array becomes empty.
    # Otherwise, `post` might be a comma we want to remove.
    # If `rest` has more items, we should just drop the first item and the comma.
    
    if post == ",":
        # we have more items.
        # we just drop `"first_img",` and the leftover spacing before the next item might need cleaning.
        # wait, `rest` starts right after the comma.
        new_gallery = rest + end
    else:
        # only one item in gallery
        new_gallery = rest + end
        
    return f'{new_pre}{new_gallery}'


new_projects_data = pattern.sub(replacer, projects_data_str)

new_content = content[:start_idx] + new_projects_data + content[end_idx:]

with open(file_path, "w", encoding="utf-8") as f:
    f.write(new_content)

print("Replacement complete.")
