function winUtil(){
	this.thisWin = null;
	this.navWin = null;
	this.listWins = [];
	this.listNum = 0;
};

var prot = {
	// Constants
	
	WIN: 1,
	NAV: 2,
	
	// Private API
	
	_createNav: function(win){
		if(Ti.Platform.osname !== 'android'){
			var navWin = Titanium.UI.iOS.createNavigationWindow({
	   			window: win
			});
			return navWin;
		}else{
			Ti.API.error("Method only for ios devices");
		}
	},
	
	_createWindow: function(name, args, options){
		var win = this._getView(name, args);
		win.open(options || {});
		return win;
	},
	_createNavWindow: function(name, args, options){
		var self = this;
		var win = this._getView(name, args);

		if(Ti.Platform.osname === 'android'){
				win.addEventListener('open', function(e){
					if(self.getNavWinCount() > 1){
						if (!win.getActivity()) {
				            Ti.API.error("Can't access action bar on a lightweight windowin.");
				        } else {
				            var actionBar = win.activity.actionBar;
				            if (actionBar) {
			            	    actionBar.displayHomeAsUp=true;
			        	        actionBar.onHomeIconItemSelected = function() {
			    	                win.close();
				                };
				            }
				            win.activity.invalidateOptionsMenu();
				        }
					}
				});
		}else{
			if(!this.navWin){
				var navWin = this._createNav(win);
				this._addNav(navWin);
				this.navWin.open(options);
			}
		}
		return win;
	},
	
	_addNav: function(navWin){
		this.navWin = navWin;
	},
	_addWin: function(win){
		this._registerWin(win, this.WIN);
	},
	_addNavWin: function(win){
		this._registerWin(win, this.NAV);
	},
	
	_openWin: function(win, options){
		win.open(options || {});
	},
	_openNavWin: function(win, options){
		var defaultOpt = {
			animated: true
		};

		var opt = options ? _.extend(defaultOpt, options) : defaultOpt;
		
		this.navWin.openWindow(win, opt);
	},
	
	_getCtrl: function(name, args){
		return Alloy.createController(name, args || {});
	},
	_getView: function(name, args){
		return this._getCtrl(name, args).getView();
	},
	_getListNum: function(){
		this.listNum++;
		return this.listNum;
	},
	_getWins: function(type){
		var wins = [];
		this.forEachWins(function(i, winNavId, win){
			if(win.winUtil && win.winUtil.type == type){
				wins.push(win);
			}
		});
		return wins;
	},
	_getWin: function(navId, type){
		var returnWin;
		this.forEachWins(function(i, winNavId, win){
			if(type && win.winUtil.type == type && winNavId == navId || !type && winNavId == navId){
				returnWin = win;
				return false;
			}
		});
		return returnWin;
	},
	
	_registerWin: function(win, type){
		var self = this;
		var navId = win.id+this._getListNum();
		this.thisWin = win;
		
		this.listWins.push(win);
		
		win.winUtil = {
			navId: navId,
			type: type
		};
		win.addEventListener('close', function(e){
			self._unregisterWin(e.source);
		});
		/*if(Ti.Platform.osname === 'android'){
			win.addEventListener('androidback', function(e){
				
			});
		}*/
	},
	
	_unregisterWin: function(win){
		var navId = win.winUtil.navId;
		var type = win.winUtil.type;
		var listWins = this.listWins;
		
		for(var i in listWins){
			var win = listWins[i];
			if(win.winUtil.navId == navId){
				/* Не используется, нельзя закрывать родительный window
				if(i == 0 && listWins[1] && Ti.Platform.osname === 'android'){
					this._removeAndroidHomeButton(listWins[1]);
				}
				*/
				listWins.splice(i, 1);
				break;
			}
		}
		this.thisWin = listWins[listWins.length-1];
	},
	
	_removeAndroidHomeButton: function(win){
		if (!win.getActivity()) {
            Ti.API.error("Can't access action bar on a lightweight windowin.");
        } else {
            var actionBar = win.activity.actionBar;
            if (actionBar) {
            	actionBar.setHomeButtonEnabled(false);
            	actionBar.setDisplayHomeAsUp(false);
            	actionBar.setOnHomeIconItemSelected(undefined);
            }
            win.activity.invalidateOptionsMenu();
        }
	},
	
	// Public API
	
	restartWin: function(name, args, options){
		var win = this._createWindow(name, args);
		
		this._openWin(win, options);
		
		this.destroy();
		
		this._addWin(win);
		
		return win;
	},
	
	restartNavWin: function(name, args, options){
		var win = this._createNavWindow(name, args);
		if(Ti.Platform.osname == 'ios'){
			var navWin = this._createNav(win);
		
			navWin.open(options);
		}else if(Ti.Platform.osname == 'android'){
			this._openWin(win, options);
		}
		
		this.destroy();
		
		this._addWin(win);
		
		if(Ti.Platform.osname == 'ios'){
			this._addNav(navWin);
			this._addNavWin(win);
		}
		
		return win;
	},
	
	openWin: function(name, args, options) {
		var win = this._createWindow(name, args);
		this._addWin(win);
		this._openWin(win, options);
		return win;
	},
	openNavWin: function(name, args, options){
		var win = this._createNavWindow(name, args, options);
		this._addNavWin(win);
		if(Ti.Platform.osname === 'android'){
			this._openWin(win, options);
		}else if(this.navWin && this.navWin.window.winUtil && this.navWin.window.winUtil.navId != win.winUtil.navId){
			this._openNavWin(win, options);
		}
		return win;
	},
	
	closeWin: function(win){
		this._unregisterWin(win);
		if(Ti.Platform.osname == 'ios' && win.winUtil.type == this.NAV && this.navWin){
			this.navWin.closeWindow(win);
		}else{
			win.close();
		}
	},
	closeWinById: function(navId, type){
		var self = this;
		this.forEachWins(function(i, winNavId, win){
			if(winNavId == navId && i != 0){
				self.closeWin(win);
				return false;
			}else if(winNavId == navId && i == 0){
				Ti.API.warn("Can not close root window: id = "+win.id+" navId = "+winNavId+". Close this window instead");
				return false;
			}
		}, type);
	},
	closeWinsByName: function(id, type){
		var self = this;
		this.forEachWins(function(i, winNavId, win){
			if(win.id == id && i != 0){
				self.closeWin(win);
			}else if(win.id == id && i == 0){
				Ti.API.warn("Can not close root window: id = "+win.id+" navId = "+winNavId+". Close this window instead");
			}
		}, type);
	},
	
	getWin: function(navId){
		return this._getWin(navId, this.WIN);
	},
	getNavWin: function(navId){
		return this._getWin(navId, this.NAV);
	},
	getWins: function(){
		return this._getWins(this.WIN);
	},
	getNavWins: function(){
		return this._getWins(this.NAV);
	},
	getWinCount: function(){
		return this.getWins().length;
	},
	getNavWinCount: function(){
		return this.getNavWins().length;
	},
	
	forEachWins: function(callback, type){
		var listWins = this.listWins;
		for(var i in listWins){
			var win = listWins[i];
			var cb;
			if(type && win.winUtil.type == type){
				cb = callback(i, win.winUtil.navId, win);
			}else if(!type){
				cb = callback(i, win.winUtil.navId, win);
			}
			if(typeof cb == 'boolean' && !cb){
				break;
			}
		}
	},
	
	destroy: function(){
		var self = this;
		this.forEachWins(function(i, navId, win){
			self.closeWin(win);
		});
		if(this.navWin){
			this.navWin.close();
			this.navWin = null;
		}
		this.thisWin = null;
	}
};

_.extend(winUtil.prototype, prot);

module.exports = winUtil;