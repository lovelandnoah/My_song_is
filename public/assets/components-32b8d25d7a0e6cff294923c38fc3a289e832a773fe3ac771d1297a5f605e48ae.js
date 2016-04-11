var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Artist = (function (_React$Component) {
  _inherits(Artist, _React$Component);

  function Artist(props) {
    _classCallCheck(this, Artist);

    _get(Object.getPrototypeOf(Artist.prototype), "constructor", this).call(this, props);
    this.state = { albumCoverUrl: "", key: "", title: this.props.title, artist: this.props.artist, isMounted: false, isChecked: null };
    this.play = this.play.bind(this);
    this.add = this.add.bind(this);
    this.albumCover = this.albumCover.bind(this);
    this.displayAdd = this.displayAdd.bind(this);
    this.songNameInPlayer = this.songNameInPlayer.bind(this);
    this.pictureInPlayer = this.pictureInPlayer.bind(this);
    // this.getSongs = this.getSongs.bind(this)
  }

  _createClass(Artist, [{
    key: "componentWillMount",
    value: function componentWillMount() {
      $(document).ajaxError(function (e, xhr, settings) {
        if (xhr.status == 401) {
          // $('.selector').html(xhr.responseText);
          alert("Create an account to add your own songs!");
        }
      });
      this.state.songId = this.props.songId;
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      this.state.isMounted = true;
      this.albumCover();
      this.state.songTitle = self.props.title;
      ////
      this.state.songId = this.props.songId;
      // this.state.isChecked = false;
      for (i = 0; i < this.props.songs.length; i++) {
        if (this.props.songs[i].song_name == this.props.title && this.props.songs[i].artist_name == this.props.artist) {
          this.state.isChecked = true;
        }
      }
      // document.getElementById(self.props.songId).checked = this.state.isChecked;
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.state.isMounted = false;
    }
  }, {
    key: "componentWillUpdate",
    value: function componentWillUpdate() {
      // this.state.isChecked = false;

      // for(i=0;i<this.props.songs.length;i++){
      //   if(this.props.songs[i].song_name == this.props.title && this.props.songs[i].artist_name == this.props.artist){
      //     this.state.isChecked = true;
      //   }
      // }
      // document.getElementById(this.props.title).checked = this.state.isChecked;
    }
  }, {
    key: "play",
    value: function play(title, artist) {
      var _this = this;

      this.songNameInPlayer(title, artist);
      this.pictureInPlayer();
      title = title.replace(/\s/g, '%20');
      artist = artist.replace(/\s/g, '%20');
      $.ajax({
        url: "http://api.dar.fm/playlist.php?&q=@artist%20" + artist + "%20@title%20" + title + "&callback=jsonp&web=1&partner_token=9388418650",
        jsonp: 'callback',
        type: 'GET',
        dataType: 'jsonp'
      }).success(function (data) {
        var player = document.getElementById("player");
        if (data.length) {
          player.src = "http://api.dar.fm/player_api.php?station_id=" + data[0].station_id + "&custom_style=radioslice&partner_token=9388418650";
          _this.props.changeStationId(data[0].station_id);
        } else {
          //todo: message song is not playing
        }
      });
    }
  }, {
    key: "songNameInPlayer",
    value: function songNameInPlayer(title, artist) {
      var titleDisplay = document.getElementById("player-title").innerHTML = title;
      var artistDisplay = document.getElementById("player-artist").innerHTML = artist;
    }
  }, {
    key: "pictureInPlayer",
    value: function pictureInPlayer() {
      var pictureDisplay = document.getElementById("main-art").style.backgroundImage = "url(" + this.state.albumCoverUrl + ")";
    }
  }, {
    key: "add",
    value: function add(songName, artist) {
      var _this2 = this;

      var self = this;
      if (!this.state.isChecked) {
        if (this.props.songs.length < 4) {
          $.ajax({
            url: '/song',
            type: 'POST',
            data: { name: songName, artist: artist, mixtape_id: this.props.mixtapeId }
          }).success(function (data) {
            _this2.state.isChecked = true;
            self.props.getSongs();
            document.getElementById(self.props.songId).checked = true;
          });
        }
        if (this.props.songs.length >= 4) {
          document.getElementById(self.props.songId).checked = false;
        }
      } else {
        var song_id = undefined;
        for (i = 0; i < this.props.songs.length; i++) {
          if (this.props.songs[i].song_name == songName && this.props.songs[i].artist_name == artist) {
            song_id = this.props.songs[i].song_id;
          }
        }
        if (song_id) {
          // delete song if unchecked
          $.ajax({
            url: '/song/' + song_id,
            type: 'DELETE'
          }).success(function (data) {
            //       data: {name: self.state.songs[songIndex].song_name, artist: self.state.songs[songIndex].artist_name, mixtape_id: self.props.mixtapeId}
            // this.setState({songs: data.songs});
            _this2.state.isChecked = false;
            self.props.getSongs();
            $(_this2.props.songId).attr('checked', false);
          });
        }
      }
    }
  }, {
    key: "albumCover",
    value: function albumCover() {
      var _this3 = this;

      self = this;
      $.ajax({
        url: "http://api.dar.fm/songart.php?artist=" + self.props.artist + "&title=" + self.props.title + "&res=med&partner_token=9388418650",
        jsonp: 'callback',
        type: 'GET',
        dataType: 'jsonp'
      }).success(function (data) {
        if (_this3.state.isMounted == true) {
          _this3.setState({ albumCoverUrl: data[0].arturl });
        }
      });
    }
  }, {
    key: "newImage",
    value: function newImage(currentTitle) {
      if (this.state.songTitle != currentTitle) {
        this.albumCover();
        this.state.songTitle = currentTitle;
      }
    }
  }, {
    key: "displayAdd",
    value: function displayAdd() {
      var _this4 = this;

      return React.createElement(
        "div",
        null,
        React.createElement("input", { id: this.props.songId, type: "checkbox", className: "big-box", checked: this.state.isChecked,
          onClick: function () {
            return _this4.add(_this4.props.title, _this4.props.artist, _this4.state.isChecked);
          }
        })
      );
    }
  }, {
    key: "render",
    value: function render() {
      var _this5 = this;

      // if(self.props.current_user) {
      checkBox = this.displayAdd();
      // }
      if (this.state.title != this.props.title || this.state.artist != this.props.artist) {
        this.state.title = this.props.title;
        this.state.artist = this.props.artist;
        this.state.isChecked = false;
        // set perm id?
        document.getElementById(this.state.songId).checked = false;
        document.getElementById(this.state.songId).id = this.props.songId;
        this.state.songId = this.props.songId;
        for (i = 0; i < this.props.songs.length; i++) {
          if (this.props.songs[i].song_name == this.props.title && this.props.songs[i].artist_name == this.props.artist) {
            document.getElementById(this.props.songId).checked = true;
            this.state.isChecked = true;
          }
        }
      }

      return React.createElement(
        "div",
        { className: "search-result-container", id: this.props.songIndex },
        React.createElement(
          "div",
          { className: "nav4 card-panel height mix-color col l4 m6 s12 z-depth-3", onClick: function () {
              return _this5.play(_this5.props.title, _this5.props.artist);
            } },
          React.createElement(
            "div",
            { className: "card-content" },
            React.createElement(
              "span",
              { className: "searchTitle" },
              this.props.title
            ),
            React.createElement(
              "span",
              { className: "searchArtist" },
              this.props.artist
            ),
            this.newImage(this.props.title),
            React.createElement(
              "form",
              { action: "#", className: "nocolor" },
              checkBox
            ),
            React.createElement("img", { src: this.state.albumCoverUrl })
          )
        )
      );
    }
  }]);

  return Artist;
})(React.Component);
var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MixTapeSong = (function (_React$Component) {
  _inherits(MixTapeSong, _React$Component);

  function MixTapeSong(props) {
    _classCallCheck(this, MixTapeSong);

    _get(Object.getPrototypeOf(MixTapeSong.prototype), "constructor", this).call(this, props);
  }

  _createClass(MixTapeSong, [{
    key: "render",
    value: function render() {
      return React.createElement(
        "div",
        null,
        React.createElement(
          "h5",
          null,
          this.props.song_name,
          " ",
          this.props.artist_name
        )
      );
    }
  }]);

  return MixTapeSong;
})(React.Component);
var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Mixtape = (function (_React$Component) {
  _inherits(Mixtape, _React$Component);

  function Mixtape(props) {
    _classCallCheck(this, Mixtape);

    _get(Object.getPrototypeOf(Mixtape.prototype), 'constructor', this).call(this, props);

    // this.playMixtape = this.playMixtape.bind(this);
    // this.deleteMixtape = this.deleteMixtape.bind(this);
    this.songNameInPlayer = this.songNameInPlayer.bind(this);
    this.pictureInPlayer = this.pictureInPlayer.bind(this);
    this.albumCover = this.albumCover.bind(this);
    // this.findPlay = this.findPlay.bind(this);
    // this.shuffle = this.shuffle.bind(this);
    this.playMultipleSongs = this.playMultipleSongs.bind(this);
    this.remove = this.remove.bind(this);
    this.changeHandler = this.changeHandler.bind(this);
  }

  _createClass(Mixtape, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      this.setState({ mixtapeUrl: "/mixtapes/" + this.props.mixtape_id });
    }

    // //                 Play random song without using api
    // shuffle(array) {
    // let currentIndex = array.length, temporaryValue, randomIndex;

    // // While there remain elements to shuffle...
    // while (0 !== currentIndex) {
    //   // Pick a remaining element...
    //   randomIndex = Math.floor(Math.random() * currentIndex);
    //   currentIndex -= 1;
    //   // And swap it with the current element.
    //   temporaryValue = array[currentIndex];
    //   array[currentIndex] = array[randomIndex];
    //   array[randomIndex] = temporaryValue;
    // }

    // return array;
    // }

    // findPlay(){
    //   let playOrder = this.shuffle(this.props.mixtape);
    //   let foundPlay = false;
    //   let attempt = 0;
    //   while(foundPlay == false && attempt < playOrder.length) {
    //     foundPlay = this.playMixtape(playOrder[attempt].song_name, playOrder[attempt].artist_name);
    //     attempt += 1;
    //   }
    // }

    // playMixtape(title, artist){
    //   let rand = Math.round(Math.random() * (this.props.mixtape.length - 1));
    //   let that = this;
    //   title = this.props.mixtape[rand].song_name.replace(/\s/g, '%20');
    //   artist = this.props.mixtape[rand].artist_name.replace(/\s/g, '%20');
    //   $.ajax({
    //     url: "http://api.dar.fm/playlist.php?&q=@artist%20" + artist + "%20@title%20" + title + "&callback=jsonp&web=1&partner_token=9388418650",
    //     jsonp: 'callback',
    //     type: 'GET',
    //     dataType: 'jsonp',
    //   }).success( data => {
    //     let player = document.getElementById("player")
    //     if(data.length){
    //       player.src = "http://api.dar.fm/player_api.php?station_id=" + data[0].station_id + "&custom_style=radioslice&partner_token=9388418650"
    //       that.albumCover(that.props.mixtape[rand].title, that.props.mixtape[rand].artist_name);
    //       that.songNameInPlayer(that.props.mixtape[rand].song_name, that.props.mixtape[rand].artist_name);
    //       return true;
    //   } else {
    //     return false;
    //   }

    //   })
    // }

  }, {
    key: 'changeHandler',
    value: function changeHandler(songIndex) {
      $.ajax({
        url: '/song/' + self.state.songs[songIndex].song_id,
        type: 'DELETE'
      }).success(function (data) {
        //       data: {name: self.state.songs[songIndex].song_name, artist: self.state.songs[songIndex].artist_name, mixtape_id: self.props.mixtapeId}
      });
      if (typeof this.props.onChange === 'function') {
        this.props.onChange(e.target.value);
      }
    }
  }, {
    key: 'playMultipleSongs',
    value: function playMultipleSongs() {
      var queries = [];
      var that = this;

      // number queries starting with 0 which is blank
      var queryNo = [""];
      for (i = 0; i < this.props.mixtape.length; i++) {
        queryNo.push(i + 2);
      }
      queryNo.pop();

      for (i = 0; i < this.props.mixtape.length; i++) {
        queries[i] = '&q' + queryNo[i] + '=(@artist%20' + this.props.mixtape[i].artist_name.replace(/\s/g, '%20') + '%20@title%20' + this.props.mixtape[i].song_name.replace(/\s/g, '%20') + ')';
      }
      $.ajax({
        url: "http://api.dar.fm/msi.php?" + queries.join(separator = [""]) + "&callback=jsonp&partner_token=9388418650",
        jsonp: 'callback',
        type: 'GET',
        dataType: 'jsonp'
      }).success(function (data) {
        if (data[0].success) {
          var player = document.getElementById("player");
          player.src = "http://api.dar.fm/player_api.php?station_id=" + data[0].result[0].station_id + "&custom_style=radioslice&partner_token=9388418650";
          that.albumCover(data[0].songmatch[0].title, data[0].songmatch[0].artist);
          that.songNameInPlayer(data[0].songmatch[0].title, data[0].songmatch[0].artist);
        } else {
          alert("song not playing");
        }
      });
    }
  }, {
    key: 'songNameInPlayer',
    value: function songNameInPlayer(title, artist) {
      var titleDisplay = document.getElementById("player-title").innerHTML = title;
      var artistDisplay = document.getElementById("player-artist").innerHTML = artist;
    }
  }, {
    key: 'pictureInPlayer',
    value: function pictureInPlayer() {
      var pictureDisplay = document.getElementById("main-art").style.backgroundImage = 'url(' + this.state.albumCoverUrl + ')';
    }
  }, {
    key: 'albumCover',
    value: function albumCover(title, artist) {
      self = this;
      $.ajax({
        url: "http://api.dar.fm/songart.php?artist=" + artist + "&title=" + title + "&res=med&partner_token=9388418650",
        jsonp: 'callback',
        type: 'GET',
        dataType: 'jsonp'
      }).success(function (data) {
        document.getElementById("main-art").style.backgroundImage = 'url(' + data[0].arturl + ')';
      });
    }
  }, {
    key: 'show_mixtape',
    value: function show_mixtape() {}
  }, {
    key: 'remove',
    value: function remove(songIndex) {
      $.ajax({
        url: '/song/' + self.state.songs[songIndex].song_id,
        type: 'DELETE'
      }).success(function (data) {
        //       data: {name: self.state.songs[songIndex].song_name, artist: self.state.songs[songIndex].artist_name, mixtape_id: self.props.mixtapeId}
      });
      // this.props.changeHandler();
    }

    // deleteMixtape(){
    //   let self = this;
    //   $.ajax({
    //     url: '/mixtapes/' + this.props.id,
    //     type: "DELETE",
    //   }).success( data => {
    //     self.props.displayUsersMixTapes('users');
    //   });
    // }

    // deleteBtn(){
    //   if(this.props.author_id == this.props.current_user.id){
    //     return(<div onClick={this.deleteMixtape} className="rightbot waves-effect waves-light btn white-text">
    //             X
    //           </div>)
    //   }
    // }

  }, {
    key: 'render',
    value: function render() {
      var _this = this;

      var songs = this.props.mixtape.map(function (song) {
        var key = 'mixtapeSong-' + song.song_id;
        return React.createElement(SongDetails, { key: key, songIndex: _this.props.mixtape.indexOf(song), songName: song.song_name, artistName: song.artist_name, songId: song.song_id, onChange: _this.props.changeHandler, mixtape: _this });
      });
      return React.createElement(
        'div',
        { className: 'pagination' },
        React.createElement(
          'div',
          { className: 'card small cyan z-depth-3 col s6 over playing-mixtape' },
          React.createElement(
            'div',
            { className: 'toop' },
            React.createElement(
              'button',
              { className: 'btn black-text', onClick: this.playMultipleSongs },
              'Play'
            )
          ),
          React.createElement(
            'div',
            { className: 'card-content white-text boxreset' },
            songs
          )
        )
      );
    }
  }]);

  return Mixtape;
})(React.Component);
var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MySongIsHome = (function (_React$Component) {
	_inherits(MySongIsHome, _React$Component);

	function MySongIsHome(props) {
		_classCallCheck(this, MySongIsHome);

		_get(Object.getPrototypeOf(MySongIsHome.prototype), 'constructor', this).call(this, props);

		// if(this.props.mixtape_id){

		//     this.state = {searchVisible: false, playMixtapeVisible: true, mixtape_id: this.props.mixtape_id};
		//   } else {
		//   	debugger
		//     this.state = {searchVisible: false, playMixtapeVisible: true};
		//   }
		this.state = { searchVisible: false, playMixtapeVisible: true, mixtape_id: this.props.mixtape_id };
		this.DisplaySearch = this.DisplaySearch.bind(this);
		this.HideSearch = this.HideSearch.bind(this);
		// this.DisplayPlayMixtape = this.DisplayPlayMixtape.bind(this);
	}

	_createClass(MySongIsHome, [{
		key: 'DisplaySearch',
		value: function DisplaySearch() {
			this.setState({ searchVisible: true });
			console.log('display');
			// this.setState({playMixtapeVisible: true});
		}
	}, {
		key: 'HideSearch',
		value: function HideSearch() {
			this.setState({ searchVisible: false });
			console.log('hide');
		}

		// DisplayPlayMixtape(mixtape_id){
		// 	//this.setState({mixtape_id: mixtape_id})
		// 	this.setState({searchVisible: false});
		// 	this.setState({playMixtapeVisible: true});
		// }

	}, {
		key: 'render',
		value: function render() {
			self = this;

			if (this.state.searchVisible) {
				return React.createElement(
					'div',
					null,
					React.createElement('br', null),
					React.createElement('br', null),
					React.createElement(
						'h1',
						{ className: 'center salt white-text tit' },
						'My Song Is'
					),
					React.createElement('br', null),
					React.createElement(PlayMixtape, { current_user: this.props.current_user, mixtape_id: this.state.mixtape_id }),
					React.createElement(
						'div',
						{ className: 'center' },
						React.createElement(
							'button',
							{ className: 'btn nav2', onClick: this.HideSearch },
							'Done'
						)
					),
					React.createElement(Search, { current_user: this.props.current_user, mixtape_id: this.state.mixtape_id })
				);
			} else {
				return React.createElement(
					'div',
					null,
					React.createElement('br', null),
					React.createElement('br', null),
					React.createElement(
						'h1',
						{ className: 'center salt white-text tit' },
						'My Song Is'
					),
					React.createElement('br', null),
					React.createElement(PlayMixtape, { current_user: this.props.current_user, mixtape_id: this.state.mixtape_id }),
					React.createElement(
						'div',
						{ className: 'center' },
						React.createElement(
							'button',
							{ className: 'btn nav2', onClick: this.DisplaySearch },
							'Edit'
						)
					)
				);
			};
		}
	}]);

	return MySongIsHome;
})(React.Component);
var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var PlayMixtape = (function (_React$Component) {
  _inherits(PlayMixtape, _React$Component);

  function PlayMixtape(props) {
    _classCallCheck(this, PlayMixtape);

    _get(Object.getPrototypeOf(PlayMixtape.prototype), 'constructor', this).call(this, props);
    this.state = { searched: false, mixtape_id: this.props.mixtape_id, mixtapeName: '', mixTapeCategory: '', songs: [], songsSearchedFor: [], songOrArtist: [], results: [], filteredResults: [], stationId: "", eventTriggered: false };
    this.getSongs = this.getSongs.bind(this);
    this.getSearchResults = this.getSearchResults.bind(this);
    this.filteredSearchResults = this.filteredSearchResults.bind(this);
    this.noArtists = this.noArtists.bind(this);
    this.pass = this.pass.bind(this);
    this.showSuggestions = this.showSuggestions.bind(this);
    this.changeHandler = this.changeHandler.bind(this);
    this.showMySongs = this.showMySongs.bind(this);
    // this.displayUsersMixTapes = this.displayUsersMixTapes.bind(this);
    // this.doSearch = this.doSearch.bind(this);

    //mixtape
    this.songNameInPlayer = this.songNameInPlayer.bind(this);
    this.pictureInPlayer = this.pictureInPlayer.bind(this);
    this.albumCover = this.albumCover.bind(this);
    // this.findPlay = this.findPlay.bind(this);
    // this.shuffle = this.shuffle.bind(this);
    this.playMultipleSongs = this.playMultipleSongs.bind(this);
    this.remove = this.remove.bind(this);
    this.changeHandler = this.changeHandler.bind(this);

    this.checkNewSong = this.checkNewSong.bind(this);
    this.attemptUpdate = this.attemptUpdate.bind(this);

    this.changeStationId = this.changeStationId.bind(this);
  }

  _createClass(PlayMixtape, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      this.setState({ mixtapeUrl: "/mixtapes/" + this.props.mixtape_id });

      // $("#main-art").addClass("hidden-desktop");
      // $("#player-bottom").addClass("hidden-desktop");
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      var self = this;
      self.showSuggestions();
      $(document).keypress(function (e) {
        if (e.which == 13) {
          self.filteredSearchResults();
        }
      });
      this.getSongs();
      this.checkNewSong();
    }

    //mixtape methods
  }, {
    key: 'changeHandler',
    value: function changeHandler(songIndex, title, artist) {
      var _this = this;

      $.ajax({
        url: '/song/' + this.state.songs[songIndex].song_id,
        type: 'DELETE'
      }).success(function (data) {
        //       data: {name: self.state.songs[songIndex].song_name, artist: self.state.songs[songIndex].artist_name, mixtape_id: self.props.mixtapeId}
        // this.setState({songs: data.songs});
        _this.getSongs();
        if (document.getElementById(title + artist)) {
          document.getElementById(title + artist).checked = false;
        }
      });
    }
  }, {
    key: 'playMultipleSongs',
    value: function playMultipleSongs() {
      var queries = [];
      var that = this;
      // number queries starting with 0 which is blank
      var queryNo = [""];
      for (i = 0; i < this.state.songs.length; i++) {
        queryNo.push(i + 2);
      }
      queryNo.pop();

      for (i = 0; i < this.state.songs.length; i++) {
        queries[i] = '&q' + queryNo[i] + '=(@artist%20' + this.state.songs[i].artist_name.replace(/\s/g, '%20') + '%20@title%20' + this.state.songs[i].song_name.replace(/\s/g, '%20') + ')';
      }
      $.ajax({
        url: "http://api.dar.fm/msi.php?" + queries.join(separator = [""]) + "&callback=jsonp&partner_token=9388418650",
        jsonp: 'callback',
        type: 'GET',
        dataType: 'jsonp'
      }).success(function (data) {
        if (data[0].success) {
          var player = document.getElementById("player");
          player.src = "http://api.dar.fm/player_api.php?station_id=" + data[0].result[0].station_id + "&custom_style=radioslice&partner_token=9388418650";
          that.albumCover(data[0].songmatch[0].title, data[0].songmatch[0].artist);
          that.songNameInPlayer(data[0].songmatch[0].title, data[0].songmatch[0].artist);
          that.changeStationId(data[0].result[0].station_id);
        } else {
          alert("song not playing");
        }
      });
    }
  }, {
    key: 'checkNewSong',
    value: function checkNewSong() {
      document.addEventListener('DOMContentLoaded', function () {
        setInterval(self.attemptUpdate, 5000);
      }, true);
      var event = new CustomEvent('DOMContentLoaded', { "detail": "Example of an event" });
      document.dispatchEvent(event);
    }
  }, {
    key: 'attemptUpdate',
    value: function attemptUpdate() {
      var _this2 = this;

      if (this.state.station_id != "") {
        (function () {
          var that = _this2;
          $.ajax({
            url: "http://api.dar.fm/playlist.php?station_id=" + that.state.station_id + "&partner_token=9388418650",
            jsonp: 'callback',
            type: 'GET',
            dataType: 'jsonp'
          }).success(function (data) {
            if (data[0] != undefined) {
              if (data[0].title != document.getElementById("player-title").innerHTML || data[0].artist != document.getElementById("player-artist").innerHTML) {
                that.albumCover(data[0].title, data[0].artist);
                that.songNameInPlayer(data[0].title, data[0].artist);
              };
            }
          });
        })();
      };
    }
  }, {
    key: 'changeStationId',
    value: function changeStationId(newId) {
      this.state.stationId = newId;
    }
  }, {
    key: 'songNameInPlayer',
    value: function songNameInPlayer(title, artist) {
      var titleDisplay = document.getElementById("player-title").innerHTML = title;
      var artistDisplay = document.getElementById("player-artist").innerHTML = artist;
    }
  }, {
    key: 'pictureInPlayer',
    value: function pictureInPlayer() {
      var pictureDisplay = document.getElementById("main-art").style.backgroundImage = 'url(' + this.state.albumCoverUrl + ')';
      $("main-art").removeClass("hidden-desktop");
      $("player-bottom").removeClass("hidden-desktop");
    }
  }, {
    key: 'albumCover',
    value: function albumCover(title, artist) {
      self = this;
      $.ajax({
        url: "http://api.dar.fm/songart.php?artist=" + artist + "&title=" + title + "&res=med&partner_token=9388418650",
        jsonp: 'callback',
        type: 'GET',
        dataType: 'jsonp'
      }).success(function (data) {
        document.getElementById("main-art").style.backgroundImage = 'url(' + data[0].arturl + ')';
        $("main-art").removeClass("hidden-desktop");
        $("player-bottom").removeClass("hidden-desktop");
      });
    }
  }, {
    key: 'getSongs',
    value: function getSongs() {
      var that = this;
      $.ajax({
        url: '/mixtapes_find_single_mixtape',
        type: 'GET',
        data: { mixtape_id: this.props.mixtape_id }
      }).success(function (data) {
        // this.setState({mixtapeName: data.name});
        that.setState({ songs: data.songs });
      });
    }
  }, {
    key: 'remove',
    value: function remove(songIndex) {
      $.ajax({
        url: '/song/' + self.state.songs[songIndex].song_id,
        type: 'DELETE'
      }).success(function (data) {
        //       data: {name: self.state.songs[songIndex].song_name, artist: self.state.songs[songIndex].artist_name, mixtape_id: self.props.mixtapeId}
      });
      this.changeHandler();
    }

    // doSearch(){
    //   this.getSearchResults();
    //   this.getImages();
    // }

  }, {
    key: 'getSearchResults',
    value: function getSearchResults() {
      var _this3 = this;

      var self = this;
      var searchTerm = self.refs.searchText.value.replace(/\s/g, "%20");
      $.ajax({
        url: "http://api.dar.fm/playlist.php?&q=" + searchTerm + "&callback=jsonp&web=1&partner_token=9388418650",
        jsonp: 'callback',
        type: 'GET',
        dataType: 'jsonp'
      }).success(function (data) {
        _this3.state.searched = true;
        _this3.setState({ results: data });
      });
    }
  }, {
    key: 'filteredSearchResults',
    value: function filteredSearchResults() {
      var _this4 = this;

      var self = this;
      var searchTerm = self.refs.searchText.value.replace(/\s/g, "%20");
      self.refs.searchText.value = "";
      $.ajax({
        url: "http://api.dar.fm/songartist.php?&q=*" + searchTerm + "*&callback=jsonp&web=1&partner_token=9388418650",
        jsonp: 'callback',
        type: 'GET',
        dataType: 'jsonp'
      }).success(function (data) {
        // songOrArtist = ""
        // $.each(data, function (key, value) {
        // if(key == parseInt(key)){
        //   songOrArtist += value;
        // }
        // });
        // this.setState({results: data});
        _this4.showFilteredResults(data);
      });
      $(".ui-helper-hidden-accessible").hide();
    }
  }, {
    key: 'showFilteredResults',
    value: function showFilteredResults(results) {
      var _this5 = this;

      var self = this;
      $.ajax({
        url: "http://api.dar.fm/allsongs.php?artist=*" + results[0] + "*&callback=jsonp&partner_token=9388418650",
        jsonp: 'callback',
        type: 'GET',
        dataType: 'jsonp'
      }).success(function (data) {
        _this5.state.searched = true;
        _this5.setState({ results: data });
      });
    }
  }, {
    key: 'showSuggestions',
    value: function showSuggestions() {
      $("#search").autocomplete({
        source: function (request, response) {
          $.ajax({
            url: "http://api.dar.fm/songartist.php?q=*" + request.term + "*&callback=jsonp&web=1&partner_token=9388418650",
            jsonp: "callback",
            type: "GET",
            dataType: "jsonp"
          }).success(function (data) {
            response(data);
          });
        }
      });
      $("#search").autocomplete({
        messages: {
          noResults: '',
          results: function () {}
        }
      });
    }
  }, {
    key: 'pass',
    value: function pass() {
      $("#mixtapeForm").slideToggle("slow");
      $("#cardHolder").slideToggle("slow");
    }
  }, {
    key: 'noArtists',
    value: function noArtists(artists) {
      if (artists && this.state.searched) {
        if (self.refs.searchText.value == "") {
          // return(<h5>Please search for an artist! </h5>);
          // todo: only show when no search value
        } else {
            // return(<h5>Add a song!.</h5>);
          }
      }
    }
  }, {
    key: 'showPlayer',
    value: function showPlayer(player) {
      if (player.src == "") {
        return;
      } else {
        return player;
      }
    }
  }, {
    key: 'showMySongs',
    value: function showMySongs(songs) {
      if (this.props.current_user.id == this.props.author_id) {
        return songs;
      }
    }

    //
    //   let songs = this.state.songs.map( song => {
    // let key = `song-${song.song_id}`;
    // return(<Song key={key} artist_name={this.props.artist_name} song_name={this.props.song_name} {...song} getSongs={this.getSongs}/>);

  }, {
    key: 'render',
    value: function render() {
      var _this6 = this;

      self = this;
      // let searchResultCards = <Artist/>;
      var i = 0;

      // if(this.state.results.length){
      //   searchResultCards = this.state.results[0].songmatch.map( artist => {
      //   return(<Artist rplay={self.playSong} mixtapeId={self.state.mixtape_id} getSongs={self.getSongs}/>)})}
      //}

      // let songsSearchedFor = this.state.songsSearchedFor.map( song => {
      //   let key = `songsSearchedFor-${song.song_id}`
      //   songsSearchedFor.push(<MixTapeSong key={key} {...song}/>);
      // });
      var searchResultCards = null;
      if (this.state.results[0] != undefined) {
        searchResultCards = this.state.results.length ? this.state.results[0].songmatch.map(function (Sartist) {
          return React.createElement(Artist, { title: Sartist.title, songIndex: "result" + self.state.results[0].songmatch.indexOf(Sartist), songs: _this6.state.songs, getSongs: _this6.getSongs, artist: Sartist.artist, key: 'artist-' + (i += 1), rplay: self.playSong, mixtapeId: self.state.mixtape_id, current_user: self.props.current_user, changeStationId: _this6.changeStationId, songId: Sartist.artist + Sartist.title });
        }) : [];
      }
      var songs = self.state.songs.map(function (song) {

        // let key = `mixtapeSong-${song.song_id}`;
        return React.createElement(Artist, { songs: _this6.state.songs, key: 'mixtapeSong-' + song.song_id, songIndex: "favorite" + self.state.songs.indexOf(song), title: song.song_name, artist: song.artist_name, songId: "selected" + song.song_id, onChange: _this6.changeHandler, getSongs: _this6.getSongs, changeStationId: _this6.changeStationId });
        // return(<SongDetails key={key} songIndex={self.state.songs.indexOf(song)} songName={song.song_name} artistName={song.artist_name} songId={song.song_id} onChange={this.changeHandler}/>);
      });

      return React.createElement(
        'div',
        null,
        React.createElement(
          'div',
          { className: 'card-panel mix-color', id: 'playing-mixtape' },
          React.createElement(
            'div',
            { className: 'pagination' },
            React.createElement(
              'div',
              { className: 'card small cyan z-depth-3 col s6 over playing-mixtape' },
              React.createElement(
                'div',
                { className: 'toop' },
                React.createElement(
                  'div',
                  { className: 'card-content white-text boxreset' },
                  this.showMySongs(songs)
                ),
                React.createElement(
                  'button',
                  { className: 'btn black-text', onClick: this.playMultipleSongs },
                  'Play'
                )
              )
            )
          )
        ),
        React.createElement('div', { id: 'mixtapeForm' }),
        React.createElement(
          'h5',
          { className: 'salt searchLabel' },
          'Search for an Artist or Song:'
        ),
        React.createElement('input', { id: 'search', className: 'large-search', type: 'text', ref: 'searchText', autofocus: 'true', placeholder: 'Song or Artist' }),
        React.createElement(
          'button',
          { onClick: this.filteredSearchResults, className: 'btn waves-effect waves-light black-text' },
          'Search'
        ),
        React.createElement(
          'div',
          { className: 'row' },
          this.noArtists(searchResultCards),
          searchResultCards
        )
      );
    }
  }]);

  return PlayMixtape;
})(React.Component);
var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Player = (function (_React$Component) {
  _inherits(Player, _React$Component);

  function Player(props) {
    _classCallCheck(this, Player);

    _get(Object.getPrototypeOf(Player.prototype), "constructor", this).call(this, props);
    this.state = { stationUrl: "" };
  }

  _createClass(Player, [{
    key: "mobilePlayer",
    value: function mobilePlayer() {
      if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        return React.createElement("div", null);
      } else {
        return React.createElement("iframe", { className: "hidden", id: "player", src: this.stationUrl });
      }
    }
  }, {
    key: "render",
    value: function render() {
      return React.createElement(
        "div",
        null,
        this.mobilePlayer()
      );
    }
  }]);

  return Player;
})(React.Component);
var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Search = (function (_React$Component) {
  _inherits(Search, _React$Component);

  function Search(props) {
    _classCallCheck(this, Search);

    _get(Object.getPrototypeOf(Search.prototype), 'constructor', this).call(this, props);
    this.state = { results: [], searched: false, mixtape_id: this.props.mixtape_id, mixtapeName: '', mixTapeCategory: '', songs: [] };
    this.getSearchResults = this.getSearchResults.bind(this);
    this.createMixtape = this.createMixtape.bind(this);
    this.getSongs = this.getSongs.bind(this);
    this.noArtists = this.noArtists.bind(this);
    this.displayDoneButton = this.displayDoneButton.bind(this);
    this.pass = this.pass.bind(this);
    this.showSuggestions = this.showSuggestions.bind(this);
  }

  _createClass(Search, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      self = this;
      self.showSuggestions();
      this.getSongs();
    }
  }, {
    key: 'getSearchResults',
    value: function getSearchResults() {
      var _this = this;

      var self = this;
      var searchTerm = self.refs.searchText.value.replace(/\s/g, "%20");
      $.ajax({
        url: "http://api.dar.fm/playlist.php?&q=" + searchTerm + "&callback=jsonp&web=1&partner_token=9388418650",
        jsonp: 'callback',
        type: 'GET',
        dataType: 'jsonp'
      }).success(function (data) {
        _this.state.searched = true;
        _this.setState({ results: data });
      });
    }
  }, {
    key: 'showSuggestions',
    value: function showSuggestions() {
      $("#search").autocomplete({
        source: function (request, response) {
          $.ajax({
            url: "http://api.dar.fm/songartist.php?q=*" + request.term + "*&callback=jsonp&web=1&partner_token=9388418650",
            jsonp: "callback",
            type: "GET",
            dataType: "jsonp"
          }).success(function (data) {
            response(data);
          });
        }
      });
    }
  }, {
    key: 'createMixtape',
    value: function createMixtape() {
      var _this2 = this;

      $.ajax({
        url: '/mixtapes',
        type: 'POST',
        data: { name: this.refs.mixtapeName.value, category: this.refs.category.value }
      }).success(function (data) {
        _this2.refs.mixtapeName.value = null;
        _this2.refs.category.value = null;
        _this2.setState({ mixtape_id: data.id, mixtapeName: data.name, mixTapeCategory: data.category, songs: [] });
        $("#mixtapeForm").slideToggle("slow");
        $("#cardHolder").slideToggle("slow");
      });
    }
  }, {
    key: 'pass',
    value: function pass() {
      $("#mixtapeForm").slideToggle("slow");
      $("#cardHolder").slideToggle("slow");
    }
  }, {
    key: 'getSongs',
    value: function getSongs() {
      var _this3 = this;

      $.ajax({
        url: '/mixtapes_find_single_mixtape',
        type: 'GET',
        data: { mixtape_id: this.state.mixtape_id }
      }).success(function (data) {
        _this3.setState({ songs: data.songs });
      });
    }
  }, {
    key: 'displayDoneButton',
    value: function displayDoneButton() {
      if (this.state.songs.length != 0) {
        return React.createElement(
          'button',
          { onClick: this.pass, className: 'btn' },
          'Done'
        );
      } else {
        return React.createElement(
          'h5',
          null,
          'Search for streaming songs to add to your new mixtape.'
        );
      }
    }
  }, {
    key: 'noArtists',
    value: function noArtists(artists) {
      if (artists.length == 0 && this.state.searched) {
        if (self.refs.searchText.value == "") {
          return React.createElement(
            'h5',
            null,
            'Please search for an artist! '
          );
        } else {
          return React.createElement(
            'h5',
            null,
            'Could not find ',
            self.refs.searchText.value,
            ' playing on a station.'
          );
        }
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _this4 = this;

      self = this;
      var i = 0;
      var artists = this.state.results.map(function (artist) {
        var key = 'artist-' + (i += 1);
        return React.createElement(Artist, _extends({ key: key }, artist, { rplay: self.playSong, mixtapeId: self.state.mixtape_id, getSongs: _this4.getSongs }));
      });

      var songArray = [];
      var songs = this.state.songs.map(function (song) {
        var key = 'song-' + song.song_id;
        songArray.push(React.createElement(MixTapeSong, _extends({ key: key }, song)));
      });

      return React.createElement(
        'div',
        null,
        React.createElement(
          'div',
          { id: 'cardHolder', className: 'row' },
          songArray
        ),
        React.createElement(
          'p',
          null,
          'Search for an Artist or Song:'
        ),
        React.createElement('input', { id: 'search', type: 'text', ref: 'searchText', autofocus: 'true', placeholder: 'Artist' }),
        React.createElement(
          'div',
          { className: 'center' },
          React.createElement(
            'button',
            { onClick: this.getSearchResults, className: 'btn waves-effect waves-light' },
            'Search'
          )
        ),
        React.createElement('br', null),
        React.createElement('br', null),
        React.createElement(
          'h4',
          { className: 'center-align center subtit salt' },
          'Songs Playing:'
        ),
        React.createElement('br', null),
        React.createElement(
          'div',
          { className: 'row' },
          this.noArtists(artists),
          artists
        )
      );
    }
  }]);

  return Search;
})(React.Component);
var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Song = (function (_React$Component) {
  _inherits(Song, _React$Component);

  function Song(props) {
    _classCallCheck(this, Song);

    _get(Object.getPrototypeOf(Song.prototype), 'constructor', this).call(this, props);
    this.state = { results: [], station_id: 0, albumCoverUrl: "" };
    this.renderPlayButton = this.renderPlayButton.bind(this);
    this.play = this.play.bind(this);
    this.deleteBtn = this.deleteBtn.bind(this);
    this.deleteSong = this.deleteSong.bind(this);
    this.albumCover = this.albumCover.bind(this);
  }

  _createClass(Song, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.renderPlayButton();
      this.albumCover();
    }
  }, {
    key: 'renderPlayButton',
    value: function renderPlayButton() {
      var _this = this;

      self = this;
      artist = this.props.artist_name.replace(/\s/g, '%20');
      song = this.props.song_name.replace(/\s/g, '%20');

      $.ajax({
        url: "http://api.dar.fm/playlist.php?q=" + artist + "%20" + song + "&callback=jsonp&web=1&partner_token=1234567890",
        jsonp: 'callback',
        type: 'GET',
        dataType: 'jsonp'
      }).success(function (data) {

        if (data.length != 0) {
          _this.setState({ station_id: data[0].station_id, results: data });
        };
      });
    }
  }, {
    key: 'mobilePlayBtn',
    value: function mobilePlayBtn(station) {
      song = this.props.song_name.replace(/\s/g, ".");
      artist = this.props.artist_name.replace(/\s/g, ".");

      if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        window.open("http://onrad.io/" + artist + "." + song);
      } else {
        this.play(station);
      }
    }
  }, {
    key: 'play',
    value: function play(station) {
      player.src = "http://api.dar.fm/player_api.php?station_id=" + this.state.station_id + "&custom_style=radioslice&partner_token=9388418650";
    }

    // deleteSong(){
    //   // let self = this;
    //   // $.ajax({
    //   //   url: '/mixtapes/' + this.props.id,
    //   //   type: "DELETE",
    //   // }).success( data => {
    //   //   self.props.displayUsersMixTapes('users');
    //   // });
    // }

    // deleteBtn(){
    //   return(<div onClick={this.deleteSong} className="btn inner flo waves-effect waves-light btn white-text">
    //             X
    //           </div>)

    // }

  }, {
    key: 'deleteSong',
    value: function deleteSong(song_id) {
      var self = this;
      $.ajax({
        url: '/song/' + song_id,
        type: 'DELETE'
      }).success(function (data) {
        self.props.getSongs();
      });
    }
  }, {
    key: 'deleteBtn',
    value: function deleteBtn(song_id) {
      var _this2 = this;

      if (self.props.current_user != null) {
        return React.createElement(
          'div',
          { onClick: function () {
              return _this2.deleteSong(song_id);
            }, className: 'ply inner flo waves-effect waves-light btn black-text' },
          'delete'
        );
      }
    }
  }, {
    key: 'albumCover',
    value: function albumCover() {
      var _this3 = this;

      song = this.props.song_name.replace(/\s/g, ".");
      artist = this.props.artist_name.replace(/\s/g, ".");
      $.ajax({
        url: "http://api.dar.fm/songart.php?artist=" + artist + "&title=" + song + "&res=med&partner_token=9388418650",
        jsonp: 'callback',
        type: 'GET',
        dataType: 'jsonp'
      }).success(function (data) {
        _this3.setState({ albumCoverUrl: data[0].arturl });
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var _this4 = this;

      return React.createElement(
        'div',
        null,
        React.createElement(
          'div',
          { className: 'paddin play-button button-grey black-text', onClick: function () {
              return _this4.play(_this4.props.title, _this4.props.artist);
            } },
          React.createElement(
            'h5',
            { className: 'inner' },
            React.createElement('img', { src: this.state.albumCoverUrl, width: '80', height: '80' }),
            React.createElement(
              'span',
              { className: 'black-text song-name' },
              this.props.song_name
            ),
            React.createElement(
              'span',
              { className: 'grey-text' },
              '  '
            ),
            React.createElement(
              'span',
              { className: 'black-text artist-name' },
              this.props.artist_name
            )
          )
        ),
        React.createElement('hr', null)
      );
    }
  }]);

  return Song;
})(React.Component);
var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SongDetails = (function (_React$Component) {
  _inherits(SongDetails, _React$Component);

  function SongDetails(props) {
    _classCallCheck(this, SongDetails);

    _get(Object.getPrototypeOf(SongDetails.prototype), "constructor", this).call(this, props);
    this.changeHandler = this.changeHandler.bind(this);
  }

  _createClass(SongDetails, [{
    key: "changeHandler",
    value: function changeHandler() {
      if (typeof this.props.onChange === 'function') {
        this.props.onChange(e.target.value);
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this = this;

      return React.createElement(
        "div",
        null,
        React.createElement(
          "p",
          { className: "" },
          " ",
          this.props.songName
        ),
        React.createElement(
          "p",
          null,
          " ",
          this.props.artistName,
          " "
        ),
        React.createElement(
          "button",
          { className: "btn black-text", onClick: function () {
              return _this.props.onChange(_this.props.songIndex, _this.props.songName, _this.props.artistName);
            } },
          "Delete"
        )
      );
    }
  }]);

  return SongDetails;
})(React.Component);
var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SortMixtapes = (function (_React$Component) {
  _inherits(SortMixtapes, _React$Component);

  function SortMixtapes(props) {
    _classCallCheck(this, SortMixtapes);

    _get(Object.getPrototypeOf(SortMixtapes.prototype), 'constructor', this).call(this, props);
    this.displayUsersMixTapes = this.displayUsersMixTapes.bind(this);
    this.state = { mixtapes: [], visible: true, rangeStart: 0, displayMyMixtapes: true };
    this.upRange = this.upRange.bind(this);
    this.downRange = this.downRange.bind(this);
  }

  _createClass(SortMixtapes, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.displayUsersMixTapes('users');
    }
  }, {
    key: 'displayUsersMixTapes',
    value: function displayUsersMixTapes(search_terms) {
      var _this = this;

      $.ajax({
        url: '/mixtapes_users_mixtapes',
        type: 'GET',
        data: { search_term: search_terms }
      }).success(function (data) {
        _this.setState({ mixtapes: data.mixtapes });
      }).error(function (data) {
        console.log(data);
      });
    }
  }, {
    key: 'upRange',
    value: function upRange() {
      oldRange = this.state.rangeStart;
      if (oldRange < this.state.mixtapes.length - 4) {
        this.setState({ rangeStart: oldRange + 4 });
      }
    }
  }, {
    key: 'downRange',
    value: function downRange() {
      oldRange = this.state.rangeStart;
      if (oldRange > 0) {
        this.setState({ rangeStart: oldRange - 4 });
      }
    }
  }, {
    key: 'renderFastForward',
    value: function renderFastForward() {
      if (this.state.rangeStart < this.state.mixtapes.length - 4) {
        return React.createElement(
          'i',
          { className: 'medium material-icons', onClick: this.upRange },
          'fast_forward'
        );
      }
    }
  }, {
    key: 'renderFastRewind',
    value: function renderFastRewind() {
      if (this.state.rangeStart > 0) {
        return React.createElement(
          'i',
          { className: 'medium material-icons', onClick: this.downRange },
          'fast_rewind'
        );
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var rangeStart = [this.state.rangeStart, this.state.rangeStart + 4];
      var mixtapesShow = this.state.mixtapes.slice(rangeStart[0], rangeStart[1]);
      var mixtapes = mixtapesShow.map(function (mixtape) {
        var key = 'mixtape-' + mixtape.id;
        return React.createElement(Mixtape, _extends({ key: key, displayUsersMixTapes: _this2.displayUsersMixTapes, current_user: _this2.props.current_user, displayPlayMixtape: _this2.props.DisplayPlayMixtape, mixtape_id: mixtape.id }, mixtape));
      });

      return React.createElement(
        'div',
        { className: 'inner' },
        React.createElement(
          'button',
          { className: 'btn waves-effect waves-light buttonnav', onClick: this.displayUsersMixTapes.bind(this, "all") },
          'Popular Mixtapes'
        ),
        React.createElement(
          'button',
          { className: 'btn waves-effect waves-light buttonnav', onClick: this.displayUsersMixTapes.bind(this, "users") },
          'My Mixtapes'
        ),
        React.createElement(
          'h3',
          { className: 'tit salt center' },
          'Mixtapes:'
        ),
        mixtapes,
        React.createElement(
          'div',
          { className: 'center' },
          this.renderFastRewind(),
          this.renderFastForward()
        )
      );
    }
  }]);

  return SortMixtapes;
})(React.Component);
var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TheHome = (function (_React$Component) {
	_inherits(TheHome, _React$Component);

	function TheHome(props) {
		_classCallCheck(this, TheHome);

		_get(Object.getPrototypeOf(TheHome.prototype), "constructor", this).call(this, props);

		if (this.props.mixtape_id) {

			this.state = { searchVisible: true, mixtape_id: this.props.mixtape_id };
		} else {
			this.state = { searchVisible: true };

			this.state = { sortMixtapesVisible: false, searchVisible: false, playMixtapeVisible: true, mixtape_id: this.props.mixtape_id };
		};

		this.DisplaySearch = this.DisplaySearch.bind(this);
	}

	_createClass(TheHome, [{
		key: "DisplaySearch",
		value: function DisplaySearch() {
			this.setState({ searchVisible: true });
		}
	}, {
		key: "render",
		value: function render() {
			if (this.state.searchVisible) {

				return React.createElement(
					"div",
					null,
					React.createElement("br", null),
					React.createElement(
						"div",
						{ className: "center" },
						React.createElement(
							"button",
							{ className: "btn nav1", onClick: this.DisplaySearch },
							"Create Mixtape"
						)
					),
					React.createElement("br", null),
					React.createElement(
						"h1",
						{ className: "center salt tit" },
						"Creating a Mixtape"
					),
					React.createElement("br", null),
					React.createElement(Search, { current_user: this.props.current_user })
				);
			};

			if (this.state.playMixtapeVisible) {

				return React.createElement(
					"div",
					null,
					React.createElement("br", null),
					React.createElement(
						"div",
						{ className: "center" },
						React.createElement(
							"button",
							{ className: "btn nav1", onClick: this.DisplaySortMixtapes },
							"Mixtapes"
						),
						React.createElement(
							"button",
							{ className: "btn nav2", onClick: this.DisplaySearch },
							"Create New Mixtape"
						)
					),
					React.createElement("br", null),
					React.createElement(
						"h1",
						{ className: "center salt white-text tit" },
						"Playin a Mix"
					),
					React.createElement("br", null),
					React.createElement(PlayMixtape, { current_user: this.props.current_user, mixtape_id: this.state.mixtape_id })
				);
			};
		}
	}]);

	return TheHome;
})(React.Component);
var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TopArtist = (function (_React$Component) {
  _inherits(TopArtist, _React$Component);

  function TopArtist(props) {
    _classCallCheck(this, TopArtist);

    _get(Object.getPrototypeOf(TopArtist.prototype), "constructor", this).call(this, props);
    this.state = { albumCoverUrl: "", isMounted: false, title: "", artist: "" };
    this.play = this.play.bind(this);
    this.add = this.add.bind(this);
    this.albumCover = this.albumCover.bind(this);
    this.displayAdd = this.displayAdd.bind(this);

    this.songNameInPlayer = this.songNameInPlayer.bind(this);
    this.pictureInPlayer = this.pictureInPlayer.bind(this);
  }

  _createClass(TopArtist, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this = this;

      this.state.title = this.props.name;
      this.state.artist = this.props.artist;
      this.state.isMounted = true;
      this.albumCover();
      $("div.chartSong").click = function () {
        return _this.mobilePlayButton(_this.props.name, _this.props.artist);
      };
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.state.isMounted = false;
    }

    // play(station){
    //   let player = document.getElementById("player")
    //   player.src = "http://api.dar.fm/player_api.php?station_id=" + station + "&custom_style=radioslice&partner_token=9388418650"
    // }

  }, {
    key: "play",
    value: function play(title, artist) {
      this.songNameInPlayer(title, artist);
      this.pictureInPlayer();
      title = title.replace(/\s/g, '%20');
      artist = artist.replace(/\s/g, '%20');
      $.ajax({
        url: "http://api.dar.fm/playlist.php?&q=@artist%20" + artist + "%20@title%20" + title + "&callback=jsonp&web=1&partner_token=9388418650",
        jsonp: 'callback',
        type: 'GET',
        dataType: 'jsonp'
      }).success(function (data) {
        var player = document.getElementById("player");
        if (data.length) {
          player.src = "http://api.dar.fm/player_api.php?station_id=" + data[0].station_id + "&custom_style=radioslice&partner_token=9388418650";
        } else {
          //todo: message song is not playing
        }
      });
    }
  }, {
    key: "songNameInPlayer",
    value: function songNameInPlayer(title, artist) {
      var titleDisplay = document.getElementById("player-title").innerHTML = title;
      var artistDisplay = document.getElementById("player-artist").innerHTML = artist;
    }
  }, {
    key: "pictureInPlayer",
    value: function pictureInPlayer() {
      var pictureDisplay = document.getElementById("main-art").style.backgroundImage = "url(" + this.state.albumCoverUrl + ")";
    }
  }, {
    key: "mobilePlayButton",
    value: function mobilePlayButton(title, artist) {
      mobileTitle = title.replace(/\s/g, ".");
      mobileArtist = artist.replace(/\s/g, ".");

      if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        window.open("http://onrad.io/" + mobileArtist + "." + mobileTitle);
      } else {
        this.play(title, artist);
      }
    }
  }, {
    key: "add",
    value: function add(songName, artist) {
      var self = this;
      // mixtape = Mixtape.where(user_id: current_user.id)
      $.ajax({
        url: '/song',
        type: 'POST',
        data: { name: songName, artist: artist, mixtape_id: mixtape }

      }).success(function (data) {

        self.props.getSongs();
      });
    }
  }, {
    key: "albumCover",
    value: function albumCover() {
      var _this2 = this;

      title = this.props.name.replace(/\s/g, '%20');
      artist = this.props.artist.replace(/\s/g, '%20');

      $.ajax({
        url: "http://api.dar.fm/songart.php?artist=" + artist + "&title=" + title + "&res=med&partner_token=9388418650",
        jsonp: 'callback',
        type: 'GET',
        dataType: 'jsonp'
      }).success(function (data) {
        if (_this2.state.isMounted == true) {
          _this2.setState({ albumCoverUrl: data[0].arturl });
        }
      });
    }
  }, {
    key: "displayAdd",
    value: function displayAdd() {
      var _this3 = this;

      if (self.props.current_user != null) {
        return React.createElement(
          "p",
          null,
          React.createElement("input", { id: this.props.title, type: "checkbox",
            defaultChecked: false,
            onClick: function () {
              return _this3.add(_this3.props.title, _this3.props.artist, _this3.checked);
            },
            checked: this.state.isChecked
          }),
          React.createElement(
            "label",
            { htmlFor: this.props.title },
            "Add"
          )
        );
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this4 = this;

      var rankStyle = {
        backgroundPosition: -40 * (this.props.rank - 1) + "px"
      };
      return React.createElement(
        "div",
        { id: "rank" + this.props.rank, className: "top-songs-list nav4 hei card-panel height mix-color col l4 m6 s12 z-depth-3", onClick: function () {
            return _this4.mobilePlayButton(_this4.state.title, _this4.state.artist);
          } },
        React.createElement("div", { className: "list-rank", style: rankStyle }),
        React.createElement(
          "div",
          { className: "list-title" },
          this.props.name
        ),
        React.createElement("img", { className: "list-art", src: this.state.albumCoverUrl }),
        React.createElement(
          "div",
          { className: "list-artist" },
          this.props.artist
        )
      );
    }
  }]);

  return TopArtist;
})(React.Component);
var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TopSongs = (function (_React$Component) {
  _inherits(TopSongs, _React$Component);

  function TopSongs(props) {
    _classCallCheck(this, TopSongs);

    _get(Object.getPrototypeOf(TopSongs.prototype), 'constructor', this).call(this, props);
    this.state = { results: [], searched: false, mixtape_id: 0, mixtapeName: '', mixTapeCategory: '', songs: [] };
    this.topCharts = this.topCharts.bind(this);
    this.editableBio = this.editableBio.bind(this);
  }

  _createClass(TopSongs, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.editableBio();
      this.topCharts();
    }
  }, {
    key: 'editableBio',
    value: function editableBio() {
      // make the bio on the user show page editable
      $(function () {
        return $('.best_in_place').best_in_place();
      });
    }
  }, {
    key: 'topCharts',
    value: function topCharts() {
      var _this = this;

      var self = this;
      $.ajax({
        url: "/static_pages/topsongs/song_popular_mysongis",
        type: 'GET',
        data: { name: this.state.name }
      }).success(function (data) {
        _this.setState({ results: data.songs });
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      self = this;
      var i = 0;
      var topartists = this.state.results.slice(0, 5).map(function (topartist) {
        var key = 'topartist-' + (i += 1);
        return React.createElement(TopArtist, _extends({ key: key, rank: i }, topartist, { rplay: self.playSong, mixtapeId: self.state.mixtape_id, getSongs: _this2.getSongs }));
      });

      return React.createElement(
        'div',
        { id: 'top-songs-container', className: 'topCard' },
        topartists
      );
    }
  }]);

  return TopSongs;
})(React.Component);
var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var UpdatingImage = (function (_React$Component) {
  _inherits(UpdatingImage, _React$Component);

  function UpdatingImage(props) {
    _classCallCheck(this, UpdatingImage);

    _get(Object.getPrototypeOf(UpdatingImage.prototype), "constructor", this).call(this, props);
  }

  _createClass(UpdatingImage, [{
    key: "componentDidMount",
    value: function componentDidMount() {}
  }, {
    key: "render",
    value: function render() {
      return React.createElement("div", { id: "target" });
    }
  }]);

  return UpdatingImage;
})(React.Component);
