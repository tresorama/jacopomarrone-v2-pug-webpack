In your JS include this and modified to your need:

```js
new Cursor({ 
  delay: 35, // deafult 0
  mediaQueryString:  "(min-width: 1200px)", // default "(min-width: 768px)"
  cursorHTML: '<div class="my-custom-cursor"></div>', // deafult '<div class="cursor"></div>'
});
```

In your CSS include this and modified to your need:

```css
.cursor {
  /* Added by consumer */
  --aspect-ratio: 1;
  /* Cursor Exposed Variables */
  --bg-color: red;
  --width: 20vw;
  --height: calc(var(--width) * var(--aspect-ratio));
  --border-radius: 0;
  --text: none;
}
```
