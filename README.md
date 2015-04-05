Ti.winUtil
===========

How use?
===========

```
var WinUtil = require('winUtil');

var winUtil = new WinUtil();

Alloy.Globals.winUtil = winUtil; // Global access from any controller

win.openWin('nameWin'); // returns titanium window

win.openNavWin('nameWin'); // returns titanium window

...

```

Methods
===========

| Name                                  | Info                                                      |
| -------------                         | -------------                                             |
| openWin(name, args, options)          | Opening a single window. <br> IOS: Will been absent header bar. <br> Android: Will be back button has been absent in actoin bar. |
| openNavWin(name, args, options)       | Opens the navigation window. <br>IOS: Will header bar. <br>Android: Button will be back in action bar. |
| restartWin(name, args, options)       | Closes all previous windows and opens a new window                |
| restartNavWin(name, args, options)    | Closes all previous windows and opens a new navigation window     |
| closeWin(window)                      | Сloses the window                                                 |
| closeWinById(id, type)                | Сloses the window by id                                           |
| closeWinsByName(id, type)             | Сloses the window by name                                         |
| destroy()                             | Destroy all windows                                               |


LICENSE
===========

The MIT License (MIT)

Copyright (c) 2014 rotorgames

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
