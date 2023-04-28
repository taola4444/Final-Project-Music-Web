export const actionType = {
  SET_USER: "SET_USER",
  SET_ALL_USERS: "SET_ALL_USERS",
  SET_ALL_ALBUMS: "SET_ALL_ALBUMS",
  SET_ALL_ARTISTS: "SET_ALL_ARTISTS",
  SET_ALL_SONGS: "SET_ALL_SONGS",
  SET_FILTER_TERM: "SET_FILTER_TERM",
  SET_ARTIST_FILTER: "SET_ARTIST_FILTER",
  SET_LANGUAGE_FILTER: "SET_LANGUAGE_FILTER",
  SET_ALBUM_FILTER: "SET_ALBUM_FILTER",
  SET_ALERT_TYPE: "SET_ALERT_TYPE",
  SET_ISSONG_PLAYING: "SET_ISSONG_PLAYING",
  SET_SONG_INDEX: "SET_SONG_INDEX",
  SET_EDIT_SONG: "SET_EDIT_SONG",
  SET_TYPE: "SET_TYPE",
  SET_TYPE_ALBUM_ARTIST_SONG: "SET_TYPE_ALBUM_ARTIST_SONG",
  SET_EDIT_ARTIST: "SET_EDIT_ARTIST",
  SET_EDIT_ALBUM: "SET_EDIT_ALBUM",
  SET_FILTER_ROLE: "SET_FILTER_ROLE",
  SET_MINI_PLAYER: "SET_MINI_PLAYER",
  SET_ALL_PROFIT: "SET_ALL_PROFIT",
  SET_ROW_PAGE: "SET_ROW_PAGE",
  SET_ROWS_PER_PAGE: "SET_ROWS_PER_PAGE",
  SET_SEARCH_SONG: "SET_SEARCH_SONG",
  SET_OPEN_DIALOG: "SET_OPEN_DIALOG",
};

const reducer = (state, action) => {
  switch (action.type) {
    case actionType.SET_USER:
      return {
        ...state,
        user: action.user,
      };
    case actionType.SET_ALL_ALBUMS:
      return {
        ...state,
        allAlbums: action.allAlbums,
      };
    case actionType.SET_ALL_ARTISTS:
      return {
        ...state,
        allArtists: action.allArtists,
      };
    case actionType.SET_ALL_SONGS:
      return {
        ...state,
        allSongs: action.allSongs,
      };
    case actionType.SET_ALL_USERS:
      return {
        ...state,
        allUsers: action.allUsers,
      };
    // Filter case
    case actionType.SET_FILTER_TERM:
      return {
        ...state,
        filterTerm: action.filterTerm,
      };
    case actionType.SET_ARTIST_FILTER:
      return {
        ...state,
        artistFilter: action.artistFilter,
      };
    case actionType.SET_LANGUAGE_FILTER:
      return {
        ...state,
        languageFilter: action.languageFilter,
      };
    case actionType.SET_ALBUM_FILTER:
      return {
        ...state,
        albumFilter: action.albumFilter,
      };
    case actionType.SET_FILTER_ROLE:
      return {
        ...state,
        roleFilter: action.roleFilter,
      };
    // Alert
    case actionType.SET_ALERT_TYPE:
      return {
        ...state,
        alertType: action.alertType,
      };
    //Play Song
    case actionType.SET_ISSONG_PLAYING:
      return {
        ...state,
        isSongPlaying: action.isSongPlaying,
      };
    case actionType.SET_SONG_INDEX:
      return {
        ...state,
        songIndex: action.songIndex,
      };
    // Edit song
    case actionType.SET_EDIT_SONG:
      return {
        ...state,
        editSongs: action.editSongs,
      };
    case actionType.SET_TYPE:
      return {
        ...state,
        typeForNew: action.typeForNew,
      };
    case actionType.SET_TYPE_ALBUM_ARTIST_SONG:
      return {
        ...state,
        typeAlbumArtistSong: action.typeAlbumArtistSong,
      };
    case actionType.SET_EDIT_ARTIST:
      return {
        ...state,
        editArtists: action.editArtists,
      };
    case actionType.SET_EDIT_ALBUM:
      return {
        ...state,
        editAlbum: action.editAlbum,
      };
    case actionType.SET_MINI_PLAYER:
      return {
        ...state,
        miniPlayer: action.miniPlayer,
      };
    case actionType.SET_ALL_PROFIT:
      return {
        ...state,
        allProfit: action.allProfit,
      };
    case actionType.SET_ROW_PAGE:
      return {
        ...state,
        page: action.page,
      };
    case actionType.SET_ROWS_PER_PAGE:
      return {
        ...state,
        rowsPerPage: action.rowsPerPage,
      };
    case actionType.SET_SEARCH_SONG:
      return {
        ...state,
        searchSong: action.searchSong,
      };
    default:
      return state;
  }
};

export default reducer;
