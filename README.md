# Computer-Graphics
This repository contains projects and code samples created using WebGL, JavaScript, and HTML for rendering 2D and 3D graphics in the browser. The code demonstrates various graphics techniques, including shader programming, object transformations, and animations, making it a helpful resource for learning and experimenting with WebGL.

# 3D Prism

This project is an interactive 3D model built with WebGL, featuring mouse-based rotation control and real-time color rendering for different parts of the object.
Features
- Mouse Interaction: Click and drag to rotate the model on the X and Y axes.
- Color Assignment: Distinct colors applied to different parts of the 3D shape (sides and bases).
- Dynamic Animation: Real-time rendering of the model, continuously updated with requestAnimationFrame.

# Koch Fractal

The classic Koch fractal, also known as the ‘Koch snowflake’, is formed by dividing each segment into three equal parts, raising an equilateral triangle in the middle segment, and repeating the process on each resulting side. To create an inverted version of the Koch fractal, where the triangles point inwards instead of outwards, you must make some adjustments to the algorithm. Here is a step-by-step explanation of how to do it:
Steps to Generate the Inverted Koch Fractal
- Divide the Segment: Divide each segment into three equal parts.
- Create the Inversion Point: Instead of creating an outward triangle, create an inward point of the current segment:
  - Find the centre point of the segment.
  - Calculate the height of the triangle (using the same proportions as in the original fractal) but inwards instead of outwards.
- Draw the Inverted Triangle:
  - Use the inversion point as the vertex of the triangle.
  - This vertex must be in the opposite direction to the outward perpendicular of the segment.
- Repeat the Process Recursively:
  - Apply this process to each of the four resulting segments and continue to subdivide the segments and add inverted triangles at each level of recursion.
