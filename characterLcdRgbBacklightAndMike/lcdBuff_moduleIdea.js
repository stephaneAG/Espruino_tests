var lcdBuffer = []; // 'll hold the stuff to be displayed on the LCD, splitted by lines
var lcdBackBuffer = [] // from which the above array is populated ( if we need scrolling text on an element )

// then, on init, we'd setup the above arrays by setting the number of chars on a line & the number of lines
var lcdCharsPerLine = 16; // or ..
var lcdLines = 2; // or 4

// the above is necessary, to know how much elements we have to show when some item is at the top of the lcd
// ex: when "scrolling down", how much elements to be added to the buffer lines fo an item (+1 or +3)

// now, we have to describe our menu hierarchy
var lcdViews = {
  label: 'main',
  handleNext: selectHighlighted, // fcn to select option or subview
  handleBack: backIfAny, // fcn to back on hierachy if any
  views: [
    {
      label: 'RGB light', // R: we could choose to display or not the label of a view to gain space on small screens
      options: [
        {
          label: 'R channel',
          displayedValue: 0.3, // shall be udpdated by the below fcn
          handleChange: function(val){ /* change the displayed value & trigger a redraw/refresh of the screen */ },
        }
      ]
    }
  ],
};

// R: to handle controls ( buttons, joysticks, rotary encoders, or whatever .. ), we act like the following:
// 1: have some 'setWatch()' set, or whatever the input ( ex: & some fcn being called ith some var to update )
// 2: whenever the need for a refresh of the lcd screen is needed, call the relevant handler, ex:
// 'lcdBuff.focused.handleNext()' -> to select the highlighted item if any
// 'lcdBuff.focused.handleBack()' -> to go back the hierachy if any
// 'lcdBuff.focused.goTo("main/RGB light")' -> to go directly to some (sub)view
// 'lcdBuff.focused.highlight("main/RGB light/R channel")' -> to highlight some (sub)view's option
// 'lcdBuff.show()' -> trigger a redraw of currently focused element ( ex: when the lcd was cleared for some other use )
// R: we could also accept callbacks, to be able to know when the changes on the stuff displayed by the lcd are done

// R: thnk about animating the 'in between views' when going to a sub or parent view ( ->> or <<- )

// R: thnk about an intro animation that'd draw the main view on callback

// R: see paper notes / thnk about handling 'scrolling' labels when highlighted
// ex: if label is bigger than space available, set an interval to 'scroll the chars' using the 2nd buffer
//     then 1: clear the interval when the last chunks are displayed 
//          2: set a timeout to go back to beginning chuncks
//          3: set a timeout after which the interval that updates the chunks 'll be run again
