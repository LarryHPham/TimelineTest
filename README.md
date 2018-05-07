# Interaction Interview Test

In this repository you will find a design for a small piece of a larger project that needs to be built to be used on the web. There is a Photoshop CC file as well as a jpeg in the `artwork` directory that you can work from, along with all vector assets.

## Time

We are not looking for a super polished finish here and want to respect the time of user taking the test. With that being said we would encourage you to limit your time working on this to ~2 hours. Feel free to tackle the areas that will maximize productiviy, while skipping steps like code automation and testing.

## Boilerplate

There is an optional `server.js` file that can be run with `npm start` providing you with hosting static files in a `public` directory to save you time.

## Font

The font used in the Photoshop doc as well as the font desired for the end result is Open Sans (regular and bold) and can be found at [Google Fonts](https://fonts.google.com/specimen/Open+Sans)

## Data

You can find json documents for populating your page at https://s3.amazonaws.com/topbox-frontend-project/data1.json. There is also a data2.json file in that folder, but data1.json corresponds to the design provided in the artwork folder of this repo. You can download these objects and serve them locally or you can consume them from S3.

### Schema
These json documents are all lists of objects. Each object is a single item on the timeline. Each objects has a

* title
   - String
   - This is the text displayed at the top left of each object.
   - It will always be provided..
* subTitle
   - String
   - This text appears just under the title.
   - Do not display anything if it is null.
   - Its color changes to match the color attribute.
   - Example: the second object in the design and the data1.json doc.
* color
   - String, either "red", "green", or null
   - This field dictates what color the subTitle, icon, and evaluation will be
   - If it is null, just use the default grey
* backgroundColor
   - String, either "red", "green", or null
   - The color of the background.
   - When it is non null, change the color of the title text to white
   - Example: the third object in the design and the data1.json doc.
* lineColor
   - String, either "red", "green", or null
   - When this is non null, change the color of the line outlining this object and the color of line leading to the next objects
   - When this is null and a previous object has already set the line color, continue to use the previous line color
   - If this is null and no previous object has set the line color, use the default color.
   - Example: the third object in the design and the data1.json doc.
* id
   - Integer
   - This isn't displayed anywhere, but is used to create references between objects
* references
   - List of integers
   - A list of ids for all other objects that should have lines drawn between them
   - Don't worry about the lines for multiple relationships overlapping.
   - Example: the second and fifth objects in the design and data1.json doc.
* icon
   - String
   - Name of the svg to display on the line.
   - The svgs for these icons are already provided in the artwork/svgs folder.
   - If this is null, display a circle like the Start and End objects in the design.
* judgmentIcon
   - String
   - Name of the svg to deisplay in the upper right.
   - The svgs for these icons are already provided in the artwork/svgs folder.
* time
   - Integer
   - Number of seconds that should be used to generate the timestamp that goes on the far left.
* evaluation
   - text
      - String
      - Displayed in the bottom left of the object below a line break
      - Color is dicated by the "color" attribute on the root
   - score
      - Integer
      - One of the two numbers displayed in the bottom right of the object
      - Color is dicated by the "color" attribute on the root
   - maxScore
      - Integer
      - The second of the two numbers displayed in the bottom right of the object
      - Color is dicated by the "color" attribute on the root
   - icon
      - String, either "checkbox" or null
      - The name of the svg to display
      - **This svg is NOT provided. You will have to make a checkbox**

## Submission

Please clone this repo; using it to share your own git project with us when you are ready.
