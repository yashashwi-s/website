export const guides = {
  "photo-on-mac-desktop-without-cropping": {
    title: "Put a photo on your Mac desktop without cropping",
    description: "Keep a portrait, landscape or panorama at its natural proportions with Arras. Add a photo, resize it and choose a frame without using a fixed widget grid.",
    image: "slideshow-layers", alt: "A tall photo and a separate floating reference at their natural proportions on a real Mac desktop",
    caption: "A portrait slideshow and a separate floating photo. Existing Arras desktop capture with sample images.",
    sections: [
      { id: "add", title: "Start with the original picture", paragraphs: ["Open Arras from the menu bar and choose Add → Add Photos or Videos. Select a local photo, or choose Try an Example to start with bundled artwork. Arras copies imported media into its local library, so the widget remains available when the original file is moved."] },
      { id: "fit", title: "Resize the photo, not a preset slot", paragraphs: ["Drag the picture to move it. Hover a corner and drag to resize it while preserving its aspect ratio. A tall portrait stays tall and a wide panorama stays wide. Choose a thin frame or Plain look if you want the edges of the original image to remain the focus.", "Shapes and Reference Tools are optional edits. A circle, arch or a crop you choose can mask part of a picture. For slideshows, Dynamic sizing preserves each picture’s proportions; Fixed sizing fills one frame and can crop. Choose the setting that matches the result you want."] },
      { id: "place", title: "Choose where it belongs", paragraphs: ["Use On Desktop to keep the photo with your desktop. Choose Floating for a reference above app windows. Lock Position when the placement is right, then save a named Setup before trying another arrangement."] },
    ],
  },
  "mac-desktop-collage": {
    title: "Make an editable photo collage on your Mac desktop",
    description: "Arrange a live Arras collage with independent photos, captions and alignment guides. Move the group, resize its members and save the desktop as a setup.",
    image: "collages", alt: "A paper collage and a transparent collage with individually framed photos and editable captions on a real Mac desktop",
    caption: "Paper and transparent collage styles, captured on the Mac desktop with sample photos.",
    sections: [
      { id: "create", title: "Build a group you can keep editing", paragraphs: ["Choose Add → Create Collage in Arras Settings and select the photos you want together. Pick a background, spacing and border, or choose a transparent style. Try an Example provides an editable starting point if you want to see a finished arrangement first.", "A desktop collage stays live. Its photos remain independently movable and resizable, rather than becoming one flattened image. Drag the empty background to move the whole group. Drag a photo to rearrange it or move it out of the collage."] },
      { id: "arrange", title: "Keep the details aligned", paragraphs: ["Hover a photo’s corner to resize it. Alignment guides help you line up nearby edges, and the collage boundary grows or shrinks as you edit. Add and remove members in Edit Collage. Apply appearance to an individual photo or copy a look between photos without replacing their media.", "Add a caption or place a text label inside the collage. Depth and Space pinning belong to the group; a detached photo retains its own standalone settings. Lock the arrangement once it is where you want it."] },
      { id: "save", title: "Keep a version before experimenting", paragraphs: ["Save a named Setup to return to this desktop later. Arrangement Undo covers movement, resizing and membership changes during the session. Export an .arras backup when you need a portable copy of the layout and its managed media."] },
    ],
  },
  "reference-images-on-mac-desktop": {
    title: "Keep reference images floating above your Mac apps",
    description: "Pin a visual reference above your work with Arras Floating depth. Keep images independent, add source notes and save different reference arrangements.",
    image: "appearance", alt: "Independently shaped photo references and transparent collages on a real Mac desktop",
    caption: "Independent shapes and editable photo groups in an existing desktop capture. Floating depth is selected in each widget or collage’s controls.",
    sections: [
      { id: "float", title: "Keep a picture beside your work", paragraphs: ["Add a local image to Arras, then change its Depth to Floating. It remains above ordinary app windows while you work. Resize it from a corner and lock its position if accidental movement would interrupt you. A collage can hold several references and controls their depth as a group.", "Pin to this Space controls desktop placement, not window depth. Use Floating to stay above apps. macOS does not expose stable numbered Space identifiers, so Space pinning follows the desktop where the widget currently sits."] },
      { id: "context", title: "Keep the source and your edits", paragraphs: ["Reference Tools provides a non-destructive crop, quarter-turn rotation, flips and grayscale, plus a note and source link. These edits keep the managed original. You can also enable Paste as Widget, Add PDF Page and Capture Screen Region in Preferences → Menu bar.", "Screen-region capture needs macOS Screen Recording permission. Ordinary local photo widgets do not need Accessibility or Full Disk Access. Hide private reference images before sharing your screen: capture exclusion is a compatibility request and some recorders can still include visible widgets."] },
      { id: "reuse", title: "Save a reference arrangement", paragraphs: ["Keep different projects in named Setups and export a backup when you want to transfer a layout. Arras focuses on desktop images, collages and slideshows. It does not provide drawing, OCR, an infinite canvas or collaboration."] },
    ],
  },
};
