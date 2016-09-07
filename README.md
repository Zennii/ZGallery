# ZGallery
A fairly basic and simple-to-use vanilla-JS portfolio gallery I made for my website portfolio website. This is currently structured around showing off your web works, with bullet-points for accomplishments and a "View Site" button

# How to use
1. Include the files in `dist/*` in your respective CSS and JS folders.
2. Add a reference to the stylesheet in the head of your html file.
3. Add a reference to the script below the `</body>` tag of your html file.
4. Add an element for each gallery you would like. Give it a unique ID. NOTE: You may style this element to set a size, but note that the responsive design of this gallery is built to work with 100% of the window's width and height. You may have to add your own responsive styles to make it work properly.
5. Underneath your zgallery.js script reference, add a new `<script></script>` block.
6. Within this script block you can now call `new ZGallery(id, [ items ]);` for each element you previously created. See below for item structure.

# Example
``` javascript
new ZGallery("#helloGallery", [
  {
    title: "Hello!"
    points: [ "This is an item.", "And these...", "... are some bullet-points for the item!" ],
    href: "http://linktowebsite.com/",
    img: "images/site0.jpg"
  },
  { ... }
]);
```

# Usage notes
- `href` is a URL that a "View Site" button on each item will link to. It is added to an `a` element that looks like a button.
- `img` will be added to all corresponding elements as a background-image. Path is relative to the html file holding the gallery element.
