/* ==========================================================================
   KURA BRAVIA APP — APPLICATION CORE (ES5 Compliant)
   - TV Streaming Layout with Expandable Sidebar (5 Items)
   - Vertically Stacked Rails
   - Category Browse/Filter Page (2D Media Grid)
   - Details Page with Dynamic Picture-in-Picture (PiP) and Combos
   - Floating Audio & Subtitle Selection Modal (Up/Down navigation)
   ========================================================================== */

// 1. MOCK MEDIA CATALOG (with Genre, Rating and Origin)
var MEDIA_CATALOG = {
  featured: {
    id: "solo-leveling",
    title: "Solo Leveling",
    type: "anime",
    rating: "9.6",
    genres: ["Action", "Adventure"],
    eyebrow: "Top Pick",
    description: "In a world of monsters and dungeons, Sung Jin-woo — known as the weakest hunter alive — receives a secret second chance to level up without limits.",
    backdrop: "images/solo-leveling.jpg",
    videoUrl: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    nationality: "International"
  },
  animes: [
    { id: "jujutsu-kaisen", title: "Jujutsu Kaisen", year: "2020", rating: "9.3", genres: ["Action", "Fantasy"], backdrop: "images/jujutsu-kaisen.jpg", videoUrl: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4", nationality: "International" },
    { id: "demon-slayer", title: "Demon Slayer", year: "2019", rating: "9.5", genres: ["Action", "Adventure"], backdrop: "images/demon-slayer.jpg", videoUrl: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4", nationality: "International" },
    { id: "solo-leveling", title: "Solo Leveling", year: "2024", rating: "9.6", genres: ["Action", "Adventure"], backdrop: "images/solo-leveling.jpg", videoUrl: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", nationality: "International" },
    { id: "cyber-moon", title: "Cyber Moon", year: "2025", rating: "8.8", genres: ["Sci-Fi", "Action"], backdrop: "images/cyber-moon.jpg", videoUrl: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4", nationality: "Domestic" },
    { id: "cowboy-bebop", title: "Cowboy Bebop", year: "1998", rating: "9.7", genres: ["Action", "Sci-Fi"], backdrop: "images/cowboy-bebop.jpg", videoUrl: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4", nationality: "International" },
    { id: "astro-boy", title: "Astro Boy", year: "1963", rating: "8.5", genres: ["Sci-Fi", "Adventure"], backdrop: "images/astro-boy.jpg", videoUrl: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4", nationality: "International" }
  ],
  series: [
    { id: "dark-horizon", title: "Dark Horizon", year: "2022", rating: "9.0", genres: ["Sci-Fi", "Drama"], backdrop: "images/dark-horizon.jpg", videoUrl: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4", nationality: "Domestic" },
    { id: "neo-tokyo", title: "Neo Tokyo", year: "2023", rating: "9.1", genres: ["Sci-Fi", "Action"], backdrop: "images/neo-tokyo.jpg", videoUrl: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4", nationality: "International" },
    { id: "steampunk-chronicles", title: "Steampunk Chronicles", year: "2021", rating: "8.9", genres: ["Adventure", "Sci-Fi"], backdrop: "images/steampunk-chronicles.jpg", videoUrl: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4", nationality: "Domestic" },
    { id: "breaking-bad", title: "Breaking Bad", year: "2008", rating: "9.8", genres: ["Drama", "Action"], backdrop: "images/breaking-bad.jpg", videoUrl: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4", nationality: "International" }
  ],
  movies: [
    { id: "cyber-moon-movie", title: "Cyber Moon: The Movie", year: "2026", rating: "8.9", genres: ["Sci-Fi", "Action"], backdrop: "images/cyber-moon.jpg", videoUrl: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutback.mp4", nationality: "Domestic" },
    { id: "neo-tokyo-hacker", title: "Neo Tokyo: Hacker", year: "2024", rating: "9.2", genres: ["Sci-Fi", "Drama"], backdrop: "images/neo-tokyo.jpg", videoUrl: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4", nationality: "International" },
    { id: "cidade-de-deus", title: "City of God", year: "2002", rating: "9.7", genres: ["Drama", "Action"], backdrop: "images/cidade-de-deus.jpg", videoUrl: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4", nationality: "Domestic" }
  ]
};

// Rail row structure (mapped by row index on the home screen)
var gridRows = [
  MEDIA_CATALOG.animes,
  MEDIA_CATALOG.series,
  MEDIA_CATALOG.movies
];

// Global filter lists
var genresList = ["All", "Action", "Adventure", "Sci-Fi", "Drama", "Fantasy"];
var yearsList = ["All", "Recent", "< 2020", "< 2010", "< 2000", "< 1970"];
var nationalitiesList = ["All", "Domestic", "International"];
var searchTypesList = ["All", "Anime", "Series", "Movies"];

var audioOptions = ["Japanese (Original)", "Portuguese (Dubbed)", "English (Dubbed)"];
var subtitleOptions = ["Portuguese (SRT)", "English (SRT)", "No Subtitles"];

// 2. APPLICATION STATE MACHINE
var AppState = {
  // Areas: 'sidebar', 'hero', 'grid', 'categories_btn', 'categories_grid', 'details', 'modal', 'search_box', 'keyboard', 'search_filters', 'search_results', 'player'
  activeArea: 'sidebar',

  // Active route: 'home', 'search', 'animes', 'series', 'movies'
  currentTab: 'home',

  // Screen transition guards
  previousArea: 'grid',
  selectedMedia: null,
  selectedCategoryType: 'anime', // 'anime', 'series', 'movies'

  // Navigation indices
  sidebarIndex: 0,       // 0=Home, 1=Anime, 2=Series, 3=Movies, 4=Search
  heroIndex: 0,          // 0=Play, 1=List
  gridRowIndex: 0,       // Rail row index (Home)
  gridColIndex: 0,       // Card column in rail (Home)

  searchResultIndex: 0,

  // Category tab filter state (legacy — kept for potential re-use)
  selectedGenreIdx: 0,
  selectedYearIdx: 0,
  selectedNatIdx: 0,
  filterRowIndex: 0,     // 0=Genre, 1=Year, 2=Origin
  filterColIndex: 0,     // Focused item within the row

  // Search page filters
  selectedSearchTypeIdx: 0,
  selectedSearchGenreIdx: 0,
  selectedSearchYearIdx: 0,
  selectedSearchNatIdx: 0,
  searchFilterRowIndex: 0,  // 0=Type, 1=Genre, 2=Year, 3=Origin
  searchFilterColIndex: 0,

  catGridRow: 0,         // Row in the category grid page
  catGridCol: 0,         // Column in the category grid page

  detailsFocusIndex: 0,  // 0=PiP Player, 1=Audio Combo, 2=Subtitle Combo
  audioIndex: 0,
  subtitleIndex: 0,

  // Modal state
  modalType: 'audio',    // 'audio' | 'subtitle'
  modalFocusIndex: 0,
  modalOptions: []
};

// Global settings and timers
var searchQuery = "";
var searchTimeout = null;
var playerControlsTimeout = null;
var heroTransitionTimeout = null;

// Subtitle synchroniser
var subtitleData = [];
var currentSubtitleIndex = -1;

// DOM cache wrapper to minimize slow getElementById queries on older TV browsers
var _domCache = {};
function getEl(id) {
  if (!_domCache[id]) {
    _domCache[id] = document.getElementById(id);
  }
  return _domCache[id];
}

// ==========================================================================
// INITIALISATION & ERROR HANDLING
// ==========================================================================
window.onerror = function(message, source, lineno, colno, error) {
  var errText = "Global Error: " + message + " at " + source + ":" + lineno;
  alert(errText);
  var splash = document.getElementById('splash-screen');
  if (splash) {
    splash.style.display = 'block';
    var splashContent = splash.querySelector('.splash-content');
    if (splashContent) {
      splashContent.innerHTML += '<div style="color:#ff5f5f; font-size:18px; margin-top:20px; text-align:left; background: rgba(0,0,0,0.85); padding:15px; border:2px solid red; font-family:monospace; word-wrap:break-word; z-index: 10000; position: relative;">' + errText + '</div>';
    }
  }
  return false;
};

window.onload = function() {
  setTimeout(function() {
    try {
      var splash = document.getElementById('splash-screen');
      if (splash) splash.style.display = 'none';

      // Render all home rails
      renderAllGrids();

      // Initialize hero banner with the featured title
      updateHeroWithMedia(MEDIA_CATALOG.featured);

      // Initialise virtual keyboard
      VirtualKeyboard.init('virtual-keyboard', handleKeyboardPress);

      // Capture global directional input
      document.onkeydown = handleKeyDown;

      // Start focus on the sidebar (Home)
      AppState.activeArea = 'sidebar';
      AppState.sidebarIndex = 0;
      updateFocusState();
    } catch (e) {
      var errStr = "Init Error: " + e.message + " | Stack: " + e.stack;
      alert(errStr);
      var splash = document.getElementById('splash-screen');
      if (splash) {
        splash.style.display = 'block';
        var splashContent = splash.querySelector('.splash-content');
        if (splashContent) {
          splashContent.innerHTML += '<div style="color:#ff5f5f; font-size:18px; margin-top:20px; text-align:left; background: rgba(0,0,0,0.85); padding:15px; border:2px solid red; font-family:monospace; word-wrap:break-word; z-index: 10000; position: relative;">' + errStr + '</div>';
        }
      }
    }
  }, 1200);
};

// ==========================================================================
// RENDERING
// ==========================================================================
function renderAllGrids() {
  for (var r = 0; r < gridRows.length; r++) {
    var rail = getEl('rail-' + r);
    if (!rail) continue;

    var html = '';
    var items = gridRows[r];
    for (var c = 0; c < items.length; c++) {
      var item = items[c];
      html += '<div class="card" id="card-r' + r + '-c' + c + '" data-row="' + r + '" data-col="' + c + '">';
      html += '  <img class="card-img" src="' + item.backdrop + '" onerror="this.style.display=\'none\';" />';
      html += '  <div class="card-overlay"><div class="card-title">' + item.title + '</div></div>';
      html += '</div>';
    }
    rail.innerHTML = html;
  }
}

// Updates the focus state of the catalog search shortcut button
function renderCategoryFilters() {
  var btnEl = getEl('catalog-filter-btn');
  if (!btnEl) return;

  if (AppState.activeArea === 'categories_btn') {
    if (btnEl.className.indexOf('focused') === -1) {
      btnEl.className += ' focused';
    }
  } else {
    btnEl.className = btnEl.className.replace(' focused', '');
  }
}

// Renders the 4-column media grid for the active category
function renderCategoryGrid() {
  var grid = getEl('categories-items-grid');
  if (!grid) return;

  var items = getFilteredCategoryItems();
  if (items.length === 0) {
    grid.innerHTML = '<div class="categories-no-results">No titles found for the selected filters.</div>';
    return;
  }

  var html = '';
  for (var i = 0; i < items.length; i++) {
    var item = items[i];
    var r = Math.floor(i / 4);
    var c = i % 4;
    html += '<div class="grid-card" id="grid-card-r' + r + '-c' + c + '" data-row="' + r + '" data-col="' + c + '">';
    html += '  <img class="grid-card-img" src="' + item.backdrop + '" onerror="this.style.display=\'none\';" />';
    html += '  <div class="grid-card-overlay"><div class="grid-card-title">' + item.title + '</div></div>';
    html += '</div>';
  }
  grid.innerHTML = html;
}

function matchYearRange(itemYear, targetRange) {
  if (targetRange === 'All') return true;
  var year = parseInt(itemYear, 10);
  if (isNaN(year)) return false;

  if (targetRange === 'Recent') {
    return year >= 2020;
  } else if (targetRange === '< 2020') {
    return year >= 2010 && year < 2020;
  } else if (targetRange === '< 2010') {
    return year >= 2000 && year < 2010;
  } else if (targetRange === '< 2000') {
    return year >= 1970 && year < 2000;
  } else if (targetRange === '< 1970') {
    return year < 1970;
  }
  return false;
}

function getFilteredCategoryItems() {
  var type = AppState.selectedCategoryType;
  var items = [];
  if (type === 'anime') items = MEDIA_CATALOG.animes;
  else if (type === 'series') items = MEDIA_CATALOG.series;
  else if (type === 'movies') items = MEDIA_CATALOG.movies;

  return items;
}

// ==========================================================================
// FOCUS MANAGER & SCREEN STATE
// ==========================================================================
function updateFocusState() {
  // Remove all existing focused classes
  var allFocused = document.querySelectorAll('.focused');
  for (var i = 0; i < allFocused.length; i++) {
    allFocused[i].className = allFocused[i].className.replace(' focused', '');
  }

  var sidebarEl = getEl('sidebar-menu');
  var area = AppState.activeArea;

  // 1. Sidebar expand/collapse control
  if (area === 'sidebar') {
    if (sidebarEl.className.indexOf('expanded') === -1) {
      sidebarEl.className += ' expanded';
    }
  } else {
    if (sidebarEl.className.indexOf('expanded') !== -1) {
      sidebarEl.className = sidebarEl.className.replace(' expanded', '');
    }
  }
  
  // 2. Sidebar active item visual update
  var menuIds = ['sb-home', 'sb-animes', 'sb-series', 'sb-filmes', 'sb-search'];
  for (var m = 0; m < menuIds.length; m++) {
    var el = getEl(menuIds[m]);
    if (el) el.className = el.className.replace(' active', '');
  }

  var activeMenuId = 'sb-home';
  if (AppState.currentTab === 'animes') activeMenuId = 'sb-animes';
  else if (AppState.currentTab === 'series') activeMenuId = 'sb-series';
  else if (AppState.currentTab === 'movies') activeMenuId = 'sb-filmes';
  else if (AppState.currentTab === 'search') activeMenuId = 'sb-search';

  var activeMenuEl = getEl(activeMenuId);
  if (activeMenuEl) activeMenuEl.className += ' active';

  // 3. Highlight the focused element in the active area
  if (area === 'sidebar') {
    var targetId = menuIds[AppState.sidebarIndex];
    var targetEl = getEl(targetId);
    if (targetEl) targetEl.className += ' focused';
  } 
  else if (area === 'hero') {
    var heroPlayBtn = getEl('hero-btn-play');
    var heroListBtn = getEl('hero-btn-list');
    if (AppState.heroIndex === 0 && heroPlayBtn) {
      heroPlayBtn.className += ' focused';
    } else if (AppState.heroIndex === 1 && heroListBtn) {
      heroListBtn.className += ' focused';
    }
  } 
  else if (area === 'grid') {
    var cardId = 'card-r' + AppState.gridRowIndex + '-c' + AppState.gridColIndex;
    var card = getEl(cardId);
    if (card) {
      card.className += ' focused';

      // A. Horizontal rail scroll
      var rail = getEl('rail-' + AppState.gridRowIndex);
      var offset = 0;
      if (AppState.gridColIndex >= 4) {
        offset = - ((AppState.gridColIndex - 3) * 310);
      }
      rail.style.transform = 'translate3d(' + offset + 'px, 0px, 0px)';

      // B. Vertical scroll — each section is 280px tall (270px height + 10px margin)
      //    We shift the y-container so the focused row is always visible.
      //    Row 0: no shift. Row 1: -280px. Row 2: -560px.
      var railsYContainer = getEl('rails-y-container');
      var sectionH = 280;
      var offsetY = 0;
      if (AppState.gridRowIndex > 0) {
        offsetY = -(AppState.gridRowIndex * sectionH);
      }
      railsYContainer.style.top = offsetY + 'px';
      updateHeroWithMedia(gridRows[AppState.gridRowIndex][AppState.gridColIndex]);
    }
  }
  else if (area === 'categories_btn') {
    renderCategoryFilters();
  }
  else if (area === 'search_filters') {
    renderSearchFilters();
  }
  else if (area === 'categories_grid') {
    var gridCardId = 'grid-card-r' + AppState.catGridRow + '-c' + AppState.catGridCol;
    var gridCard = getEl(gridCardId);
    if (gridCard) {
      gridCard.className += ' focused';

      // Vertical scroll for the category grid (card height 220px + margin 30px)
      var catGrid = getEl('categories-items-grid');
      var offsetCatY = - (AppState.catGridRow * 250);
      catGrid.style.transform = 'translate3d(0px, ' + offsetCatY + 'px, 0px)';
    }
  } 
  else if (area === 'details') {
    var pip = getEl('details-pip-player');
    var cAudio = getEl('combo-audio');
    var cSubtitle = getEl('combo-subtitle');
    
    if (AppState.detailsFocusIndex === 0 && pip) pip.className += ' focused';
    else if (AppState.detailsFocusIndex === 1 && cAudio) cAudio.className += ' focused';
    else if (AppState.detailsFocusIndex === 2 && cSubtitle) cSubtitle.className += ' focused';
  }
  else if (area === 'modal') {
    renderSelectionModal();
  }
  else if (area === 'search_box') {
    var searchBox = getEl('search-box');
    if (searchBox) searchBox.className += ' focused';
  } 
  else if (area === 'keyboard') {
    VirtualKeyboard.updateFocus();
  } 
  else if (area === 'search_results') {
    var results = document.querySelectorAll('.result-item');
    var activeResult = results[AppState.searchResultIndex];
    if (activeResult) activeResult.className += ' focused';
  }
}

function updateHeroWithMedia(media) {
  if (!media) return;
  
  var wrapper = getEl('hero-details-wrapper');
  var poster = getEl('hero-poster');
  
  if (wrapper) wrapper.style.opacity = '0';
  if (poster) poster.style.opacity = '0';
  
  if (heroTransitionTimeout) clearTimeout(heroTransitionTimeout);
  
  heroTransitionTimeout = setTimeout(function() {
    var heroTitle = getEl('hero-title');
    var heroDesc = getEl('hero-description');
    var heroPoster = getEl('hero-poster');
    var heroEyebrow = getEl('hero-eyebrow');

    if (heroTitle) heroTitle.innerHTML = media.title;
    if (heroDesc) heroDesc.innerHTML = 'Year: ' + media.year + ' · Rating: ★ ' + (media.rating || '9.0') + ' · Kura Local Media.';
    if (heroPoster) {
      var img = getEl('hero-poster-img');
      if (img) {
        img.style.display = 'block';
        img.src = media.backdrop;
      }
    }
    if (heroEyebrow) heroEyebrow.innerHTML = 'Catalog ' + (AppState.gridRowIndex === 0 ? 'Anime' : (AppState.gridRowIndex === 1 ? 'Series' : 'Movies'));
    
    if (wrapper) wrapper.style.opacity = '1';
    if (poster) poster.style.opacity = '1';
  }, 150);
}

// ==========================================================================
// TITLE DETAILS PAGE (with dynamic PiP)
// ==========================================================================
function openDetailsPage(media) {
  AppState.selectedMedia = media;
  AppState.previousArea = AppState.activeArea;
  AppState.activeArea = 'details';
  AppState.detailsFocusIndex = 0; // focus PiP player first

  // Populate details screen
  getEl('details-title').innerHTML = media.title;
  getEl('details-year').innerHTML = media.year;
  getEl('details-rating').innerHTML = '\u2605 ' + (media.rating || '9.0');
  getEl('details-genres').innerHTML = media.genres ? media.genres.join(', ') : 'General';
  getEl('details-description').innerHTML = 'Watch now in local high definition. This title was catalogued by the high-performance Kura server. Full audio and subtitle options available for your Bravia client.';

  getEl('details-eyebrow').innerHTML = media.genres ? media.genres[0].toUpperCase() : 'MEDIA';

  // Backdrop background (frame from selected title)
  var backdropEl = getEl('details-backdrop');
  if (backdropEl) {
    var img = getEl('details-backdrop-img');
    if (img) {
      img.style.display = 'block';
      img.src = media.backdrop;
    }
  }

  // Reset combos to defaults
  AppState.audioIndex = 0;
  AppState.subtitleIndex = 0;
  getEl('val-audio').innerHTML = audioOptions[0];
  getEl('val-subtitle').innerHTML = subtitleOptions[0];

  // Hide all views and activate details
  hideAllViews();
  getEl('view-details').className = 'view active';

  // Start the PiP mini player
  var pipVideo = getEl('kuraPipPlayer');
  var pipSource = getEl('pipSource');
  if (pipVideo && pipSource) {
    pipVideo.pause();
    pipSource.setAttribute('src', media.videoUrl);
    pipVideo.load();
    pipVideo.play();
  }
  
  updateFocusState();
}

function closeDetailsPage() {
  // Stop PiP and close modal
  var pipVideo = getEl('kuraPipPlayer');
  if (pipVideo) pipVideo.pause();
  getEl('selection-modal').style.display = 'none';

  // Restore previous view
  hideAllViews();
  if (AppState.currentTab === 'home') {
    getEl('view-home').className = 'view active';
    AppState.activeArea = 'grid';
  } else if (AppState.currentTab === 'search') {
    getEl('view-search').className = 'view active';
    renderSearchFilters();
    executeSearch();
    var results = getFilteredResults();
    if (results.length > 0) {
      AppState.activeArea = 'search_results';
    } else {
      AppState.activeArea = 'search_box';
    }
  } else {
    getEl('view-categories').className = 'view active';
    renderCategoryFilters();
    renderCategoryGrid();
    var items = getFilteredCategoryItems();
    if (items.length > 0) {
      AppState.activeArea = 'categories_grid';
    } else {
      AppState.activeArea = 'categories_btn';
    }
  }
  updateFocusState();
}

function hideAllViews() {
  getEl('view-home').className = 'view';
  getEl('view-search').className = 'view';
  getEl('view-categories').className = 'view';
  getEl('view-details').className = 'view';
}

// ==========================================================================
// AUDIO & SUBTITLE SELECTION MODAL
// ==========================================================================
function openSelectionModal(type) {
  AppState.activeArea = 'modal';
  AppState.modalType = type;
  AppState.modalFocusIndex = type === 'audio' ? AppState.audioIndex : AppState.subtitleIndex;
  AppState.modalOptions = type === 'audio' ? audioOptions : subtitleOptions;
  
  renderSelectionModal();
}

function renderSelectionModal() {
  var titleEl = getEl('modal-title-text');
  var listEl = getEl('modal-options-list');
  if (!titleEl || !listEl) return;
  
  titleEl.innerHTML = AppState.modalType === 'audio' ? 'Select Audio' : 'Select Subtitle';
  
  var activeIdx = AppState.modalType === 'audio' ? AppState.audioIndex : AppState.subtitleIndex;
  var html = '';
  for (var i = 0; i < AppState.modalOptions.length; i++) {
    var item = AppState.modalOptions[i];
    var isSelected = (i === activeIdx);
    var isFocused = (i === AppState.modalFocusIndex);
    
    var classes = 'modal-item';
    if (isSelected) classes += ' selected';
    if (isFocused) classes += ' focused';
    
    html += '<div class="' + classes + '" id="modal-item-' + i + '">';
    html += '  <span>' + item + '</span>';
    if (isSelected) {
      html += '  <span class="modal-item-check">✔</span>';
    }
    html += '</div>';
  }
  listEl.innerHTML = html;
  getEl('selection-modal').style.display = 'block';
}

function handleModalNavigation(key) {
  if (key === 8 || key === 461) { // BACKSPACE -> close modal without saving
    getEl('selection-modal').style.display = 'none';
    AppState.activeArea = 'details';
    updateFocusState();
    return;
  }

  if (key === 38) { // UP
    if (AppState.modalFocusIndex > 0) {
      AppState.modalFocusIndex--;
      renderSelectionModal();
    }
  }
  else if (key === 40) { // DOWN
    if (AppState.modalFocusIndex < AppState.modalOptions.length - 1) {
      AppState.modalFocusIndex++;
      renderSelectionModal();
    }
  }
  else if (key === 13) { // ENTER -> save choice and close
    if (AppState.modalType === 'audio') {
      AppState.audioIndex = AppState.modalFocusIndex;
      var valAudio = getEl('val-audio');
      if (valAudio) valAudio.innerHTML = audioOptions[AppState.audioIndex];
    } else {
      AppState.subtitleIndex = AppState.modalFocusIndex;
      var valSub = getEl('val-subtitle');
      if (valSub) valSub.innerHTML = subtitleOptions[AppState.subtitleIndex];
    }
    
    getEl('selection-modal').style.display = 'none';
    AppState.activeArea = 'details';
    updateFocusState();
  }
}

// ==========================================================================
// KEYBOARD / REMOTE CONTROL INPUT MAPPING
// ==========================================================================
function handleKeyDown(e) {
  var keyCode = e.keyCode;
  if (keyCode === 27) keyCode = 8; // Map ESC to Backspace
  
  var area = AppState.activeArea;
  
  if (area === 'sidebar') handleSidebarNavigation(keyCode);
  else if (area === 'hero') handleHeroNavigation(keyCode);
  else if (area === 'grid') handleGridNavigation(keyCode);
  else if (area === 'categories_btn') handleCategoriesBtnNavigation(keyCode);
  else if (area === 'categories_grid') handleCategoriesGridNavigation(keyCode);
  else if (area === 'details') handleDetailsNavigation(keyCode);
  else if (area === 'modal') handleModalNavigation(keyCode);
  else if (area === 'search_box') handleSearchBoxNavigation(keyCode);
  else if (area === 'keyboard') handleKeyboardNavigation(keyCode);
  else if (area === 'search_filters') handleSearchFiltersNavigation(keyCode);
  else if (area === 'search_results') handleSearchResultsNavigation(keyCode);
  else if (area === 'player') handlePlayerControl(keyCode);
}

// 1. Sidebar Navigation (Home, Anime, Series, Movies, Search)
function handleSidebarNavigation(key) {
  if (key === 40) { // DOWN
    if (AppState.sidebarIndex < 4) {
      AppState.sidebarIndex++;
      updateFocusState();
    }
  }
  else if (key === 38) { // UP
    if (AppState.sidebarIndex > 0) {
      AppState.sidebarIndex--;
      updateFocusState();
    }
  }
  else if (key === 13) { // ENTER
    selectActiveSidebarTab();
  }
  else if (key === 39) { // RIGHT -> return to the active tab body
    if (getEl('view-details').className.indexOf('active') !== -1) {
      AppState.activeArea = 'details';
    } else {
      if (AppState.currentTab === 'home') AppState.activeArea = 'hero';
      else if (AppState.currentTab === 'search') AppState.activeArea = 'search_box';
      else AppState.activeArea = 'categories_grid';
    }
    updateFocusState();
  }
}

function selectActiveSidebarTab() {
  var indexTabs = ['home', 'animes', 'series', 'filmes', 'search'];
  var tab = indexTabs[AppState.sidebarIndex];
  AppState.currentTab = tab;
  
  hideAllViews();
  
  if (tab === 'home') {
    getEl('view-home').className = 'view active';
    AppState.activeArea = 'hero';
  } 
  else if (tab === 'search') {
    getEl('view-search').className = 'view active';
    AppState.activeArea = 'search_box';
    AppState.selectedSearchTypeIdx = 0;
    AppState.selectedSearchGenreIdx = 0;
    AppState.selectedSearchYearIdx = 0;
    AppState.selectedSearchNatIdx = 0;
    AppState.searchFilterRowIndex = 0;
    AppState.searchFilterColIndex = 0;
    searchQuery = "";
    var textEl = getEl('search-input-text');
    if (textEl) {
      textEl.innerHTML = "Digite para buscar...";
      textEl.style.color = '#96A3B8';
    }
    renderSearchFilters();
    executeSearch();
  }
  else {
    // Dedicated catalog tabs: 'animes', 'series', 'movies'
    getEl('view-categories').className = 'view active';
    var titleEl = getEl('categories-title');
    if (tab === 'animes') {
      AppState.selectedCategoryType = 'anime';
      if (titleEl) titleEl.innerHTML = 'Catalog: Anime';
    } else if (tab === 'series') {
      AppState.selectedCategoryType = 'series';
      if (titleEl) titleEl.innerHTML = 'Catalog: Series';
    } else {
      AppState.selectedCategoryType = 'movies';
      if (titleEl) titleEl.innerHTML = 'Catalog: Movies';
    }
    
    AppState.catGridRow = 0;
    AppState.catGridCol = 0;
    
    renderCategoryFilters();
    renderCategoryGrid();
    
    AppState.activeArea = 'categories_grid';
  }
  updateFocusState();
}

// 2. Hero Navigation (Home)
function handleHeroNavigation(key) {
  if (key === 37) { // LEFT
    if (AppState.heroIndex === 1) {
      AppState.heroIndex = 0;
      updateFocusState();
    } else {
      AppState.activeArea = 'sidebar';
      AppState.sidebarIndex = 0;
      updateFocusState();
    }
  }
  else if (key === 39) { // RIGHT
    if (AppState.heroIndex === 0) {
      AppState.heroIndex = 1;
      updateFocusState();
    }
  }
  else if (key === 40) { // DOWN
    AppState.activeArea = 'grid';
    AppState.gridRowIndex = 0;
    AppState.gridColIndex = 0;
    updateFocusState();
  }
  else if (key === 13) { // ENTER
    openDetailsPage(MEDIA_CATALOG.featured);
  }
}

// 3. Home 2D Rail Navigation
function handleGridNavigation(key) {
  var currentRailItems = gridRows[AppState.gridRowIndex];

  if (key === 37) { // LEFT
    if (AppState.gridColIndex > 0) {
      AppState.gridColIndex--;
      updateFocusState();
    } else {
      AppState.activeArea = 'sidebar';
      AppState.sidebarIndex = 0;
      updateFocusState();
    }
  }
  else if (key === 39) { // RIGHT
    if (AppState.gridColIndex < currentRailItems.length - 1) {
      AppState.gridColIndex++;
      updateFocusState();
    }
  }
  else if (key === 38) { // UP
    if (AppState.gridRowIndex === 0) {
      AppState.activeArea = 'hero';
      AppState.heroIndex = 0;
    } else {
      AppState.gridRowIndex--;
      var maxCol = gridRows[AppState.gridRowIndex].length - 1;
      if (AppState.gridColIndex > maxCol) AppState.gridColIndex = maxCol;
    }
    updateFocusState();
  }
  else if (key === 40) { // DOWN
    if (AppState.gridRowIndex < gridRows.length - 1) {
      AppState.gridRowIndex++;
      var maxCol = gridRows[AppState.gridRowIndex].length - 1;
      if (AppState.gridColIndex > maxCol) AppState.gridColIndex = maxCol;
      updateFocusState();
    }
  }
  else if (key === 13) { // ENTER -> Open details
    var media = currentRailItems[AppState.gridColIndex];
    openDetailsPage(media);
  }
}

// 4. Category Filter Shortcut Button Navigation
function handleCategoriesBtnNavigation(key) {
  if (key === 37) { // LEFT -> open sidebar
    AppState.activeArea = 'sidebar';
    AppState.sidebarIndex = AppState.currentTab === 'animes' ? 1 : (AppState.currentTab === 'series' ? 2 : 3);
    updateFocusState();
  }
  else if (key === 40) { // DOWN -> move to the card grid
    var items = getFilteredCategoryItems();
    if (items.length > 0) {
      AppState.activeArea = 'categories_grid';
      AppState.catGridRow = 0;
      AppState.catGridCol = 0;
      updateFocusState();
    }
  }
  else if (key === 13) { // ENTER -> open Search with the matching type pre-selected
    var targetTypeIdx = 0; // 'All'
    if (AppState.selectedCategoryType === 'anime') targetTypeIdx = 1;
    else if (AppState.selectedCategoryType === 'series') targetTypeIdx = 2;
    else if (AppState.selectedCategoryType === 'movies') targetTypeIdx = 3;

    // Configure search state
    AppState.currentTab = 'search';
    AppState.sidebarIndex = 4; // Point to 'Search' in sidebar
    AppState.activeArea = 'search_filters';
    AppState.selectedSearchTypeIdx = targetTypeIdx;
    AppState.selectedSearchGenreIdx = 0;
    AppState.selectedSearchYearIdx = 0;
    AppState.selectedSearchNatIdx = 0;
    AppState.searchFilterRowIndex = 0; // Focus the Type row
    AppState.searchFilterColIndex = targetTypeIdx;
    searchQuery = "";

    var textEl = getEl('search-input-text');
    if (textEl) {
    textEl.innerHTML = "Digite para buscar...";
      textEl.style.color = '#96A3B8';
    }

    hideAllViews();
    getEl('view-search').className = 'view active';

    renderSearchFilters();
    executeSearch();
    updateFocusState();
  }
}

// 5. Category 2D Grid Navigation
function handleCategoriesGridNavigation(key) {
  var items = getFilteredCategoryItems();
  var rowItemsCount = 4;

  if (key === 37) { // LEFT
    if (AppState.catGridCol > 0) {
      AppState.catGridCol--;
      updateFocusState();
    } else {
      // Open sidebar
      AppState.activeArea = 'sidebar';
      AppState.sidebarIndex = AppState.currentTab === 'animes' ? 1 : (AppState.currentTab === 'series' ? 2 : 3);
      updateFocusState();
    }
  }
  else if (key === 39) { // RIGHT
    var totalIndex = (AppState.catGridRow * rowItemsCount) + AppState.catGridCol;
    if (totalIndex < items.length - 1 && AppState.catGridCol < 3) {
      AppState.catGridCol++;
      updateFocusState();
    }
  }
  else if (key === 38) { // UP
    if (AppState.catGridRow === 0) {
      // Move up to the filter shortcut button
      AppState.activeArea = 'categories_btn';
    } else {
      AppState.catGridRow--;
    }
    updateFocusState();
  }
  else if (key === 40) { // DOWN
    var nextRowIndex = ((AppState.catGridRow + 1) * rowItemsCount) + AppState.catGridCol;
    if (nextRowIndex < items.length) {
      AppState.catGridRow++;
      updateFocusState();
    }
  }
  else if (key === 13) { // ENTER -> Open details
    var index = (AppState.catGridRow * rowItemsCount) + AppState.catGridCol;
    var media = items[index];
    if (media) openDetailsPage(media);
  }
}

// 6. Details Page Navigation (PiP Player + Combos)
function handleDetailsNavigation(key) {
  if (key === 8 || key === 461) { // BACKSPACE -> close details
    closeDetailsPage();
    return;
  }

  var fIdx = AppState.detailsFocusIndex;

  if (fIdx === 0) { // Focus: PiP Player
    if (key === 40 || key === 37) { // Down or Left -> Audio Combo
      AppState.detailsFocusIndex = 1;
      updateFocusState();
    }
  }
  else if (fIdx === 1) { // Focus: Audio Combo
    if (key === 38) { // Up -> PiP
      AppState.detailsFocusIndex = 0;
      updateFocusState();
    }
    else if (key === 39) { // Right -> Subtitle Combo
      AppState.detailsFocusIndex = 2;
      updateFocusState();
    }
    else if (key === 37) { // Left -> open Sidebar
      AppState.activeArea = 'sidebar';
      AppState.sidebarIndex = AppState.currentTab === 'home' ? 0 : (AppState.currentTab === 'animes' ? 1 : (AppState.currentTab === 'series' ? 2 : (AppState.currentTab === 'movies' ? 3 : 4)));
      updateFocusState();
    }
  }
  else if (fIdx === 2) { // Focus: Subtitle Combo
    if (key === 38) { // Up -> PiP
      AppState.detailsFocusIndex = 0;
      updateFocusState();
    }
    else if (key === 37) { // Left -> Audio Combo
      AppState.detailsFocusIndex = 1;
      updateFocusState();
    }
    else if (key === 39) { // Right -> PiP
      AppState.detailsFocusIndex = 0;
      updateFocusState();
    }
  }

  // ENTER on the details page -> open dropdown modal
  if (key === 13) {
    if (fIdx === 0) {
      // Expand PiP to full screen
      var pipVideo = getEl('kuraPipPlayer');
      var currentTime = 0;
      if (pipVideo) {
        currentTime = pipVideo.currentTime;
        pipVideo.pause();
      }
      playVideo(AppState.selectedMedia.videoUrl, AppState.selectedMedia.title, currentTime);
    }
    else if (fIdx === 1) {
      // Open audio selection modal
      openSelectionModal('audio');
    }
    else if (fIdx === 2) {
      // Open subtitle selection modal
      openSelectionModal('subtitle');
    }
  }
}

// 7. Search box, filters and keyboard navigation
function handleSearchBoxNavigation(key) {
  if (key === 37) { // LEFT
    AppState.activeArea = 'sidebar';
    AppState.sidebarIndex = 4;
    updateFocusState();
  }
  else if (key === 40) { // DOWN
    AppState.activeArea = 'keyboard';
    updateFocusState();
  }
  else if (key === 39) { // RIGHT
    AppState.activeArea = 'search_filters';
    AppState.searchFilterRowIndex = 0;
    AppState.searchFilterColIndex = 0;
    updateFocusState();
  }
}

function handleKeyboardNavigation(key) {
  if (key === 38) { // UP
    if (VirtualKeyboard.currentRow === 0) {
      AppState.activeArea = 'search_box';
      updateFocusState();
    } else {
      VirtualKeyboard.move('UP');
    }
  }
  else if (key === 40) { // DOWN
    VirtualKeyboard.move('DOWN');
  }
  else if (key === 37) { // LEFT
    if (VirtualKeyboard.currentCol === 0) {
      AppState.activeArea = 'sidebar';
      AppState.sidebarIndex = 4;
      updateFocusState();
    } else {
      VirtualKeyboard.move('LEFT');
    }
  }
  else if (key === 39) { // RIGHT
    var maxCol = VirtualKeyboard.layout[VirtualKeyboard.currentRow].length - 1;
    if (VirtualKeyboard.currentCol === maxCol) {
      AppState.activeArea = 'search_filters';
      AppState.searchFilterRowIndex = 1; // focus Genre row
      AppState.searchFilterColIndex = 0;
      updateFocusState();
    } else {
      VirtualKeyboard.move('RIGHT');
    }
  }
  else if (key === 13) { // ENTER
    VirtualKeyboard.pressActiveKey();
  }
  else if (key === 8) { // BACKSPACE
    handleKeyboardPress('BACKSPACE');
  }
}

// 8. Search Filters Navigation (Type / Genre / Year / Origin rows)
function handleSearchFiltersNavigation(key) {
  var rowLengths = [searchTypesList.length, genresList.length, yearsList.length, nationalitiesList.length];
  var rowLength = rowLengths[AppState.searchFilterRowIndex] || nationalitiesList.length;

  if (key === 37) { // LEFT
    if (AppState.searchFilterColIndex > 0) {
      AppState.searchFilterColIndex--;
      updateFocusState();
    } else {
      // Return to the left panel
      if (AppState.searchFilterRowIndex === 0) {
        AppState.activeArea = 'search_box';
      } else {
        AppState.activeArea = 'keyboard';
      }
      updateFocusState();
    }
  }
  else if (key === 39) { // RIGHT
    if (AppState.searchFilterColIndex < rowLength - 1) {
      AppState.searchFilterColIndex++;
      updateFocusState();
    }
  }
  else if (key === 38) { // UP
    if (AppState.searchFilterRowIndex > 0) {
      AppState.searchFilterRowIndex--;
      var newLength = rowLengths[AppState.searchFilterRowIndex];
      if (AppState.searchFilterColIndex >= newLength) AppState.searchFilterColIndex = newLength - 1;
      updateFocusState();
    } else {
      AppState.activeArea = 'search_box';
      updateFocusState();
    }
  }
  else if (key === 40) { // DOWN
    if (AppState.searchFilterRowIndex < 3) {
      AppState.searchFilterRowIndex++;
      var newLength = rowLengths[AppState.searchFilterRowIndex];
      if (AppState.searchFilterColIndex >= newLength) AppState.searchFilterColIndex = newLength - 1;
      updateFocusState();
    } else {
      var results = getFilteredResults();
      if (results.length > 0) {
        AppState.activeArea = 'search_results';
        AppState.searchResultIndex = 0;
        updateFocusState();
      }
    }
  }
  else if (key === 13) { // ENTER -> select filter
    if (AppState.searchFilterRowIndex === 0) {
      AppState.selectedSearchTypeIdx = AppState.searchFilterColIndex;
    } else if (AppState.searchFilterRowIndex === 1) {
      AppState.selectedSearchGenreIdx = AppState.searchFilterColIndex;
    } else if (AppState.searchFilterRowIndex === 2) {
      AppState.selectedSearchYearIdx = AppState.searchFilterColIndex;
    } else {
      AppState.selectedSearchNatIdx = AppState.searchFilterColIndex;
    }
    executeSearch();
    renderSearchFilters();
    updateFocusState();
  }
}

// 9. Search Results Navigation
function handleSearchResultsNavigation(key) {
  var items = document.querySelectorAll('.result-item');
  if (key === 37) { // LEFT
    AppState.activeArea = 'keyboard';
    updateFocusState();
  }
  else if (key === 38) { // UP
    if (AppState.searchResultIndex > 0) {
      AppState.searchResultIndex--;
      updateFocusState();
    } else {
      // Return to last filter row (Origin / Row 3)
      AppState.activeArea = 'search_filters';
      AppState.searchFilterRowIndex = 3;
      AppState.searchFilterColIndex = AppState.selectedSearchNatIdx;
      updateFocusState();
    }
  }
  else if (key === 40) { // DOWN
    if (AppState.searchResultIndex < items.length - 1) {
      AppState.searchResultIndex++;
      updateFocusState();
    }
  }
  else if (key === 13) { // ENTER
    var resultsData = getFilteredResults();
    var media = resultsData[AppState.searchResultIndex];
    if (media) openDetailsPage(media);
  }
}

function renderSearchFilters() {
  var container = getEl('search-filters-container');
  if (!container) return;

  var html = '';

  // Row 0: Type
  html += '<div class="filter-row-container" style="height: 30px; line-height: 30px; margin-bottom: 8px;">';
  html += '  <span class="filter-row-label" style="width: 100px; font-size: 13px;">Type:</span>';
  html += '  <div class="filter-row-items">';
  for (var i = 0; i < searchTypesList.length; i++) {
    var isSelected = (i === AppState.selectedSearchTypeIdx);
    var isFocused = (AppState.activeArea === 'search_filters' && AppState.searchFilterRowIndex === 0 && i === AppState.searchFilterColIndex);
    var classes = 'filter-tab';
    if (isSelected) classes += ' active';
    if (isFocused) classes += ' focused';
    html += '    <div class="' + classes + '" style="font-size: 13px; padding: 0 15px; height: 26px; line-height: 24px; margin-right: 8px;" id="search-filter-r0-c' + i + '">' + searchTypesList[i] + '</div>';
  }
  html += '  </div>';
  html += '</div>';

  // Row 1: Genre
  html += '<div class="filter-row-container" style="height: 30px; line-height: 30px; margin-bottom: 8px;">';
  html += '  <span class="filter-row-label" style="width: 100px; font-size: 13px;">Genre:</span>';
  html += '  <div class="filter-row-items">';
  for (var i = 0; i < genresList.length; i++) {
    var isSelected = (i === AppState.selectedSearchGenreIdx);
    var isFocused = (AppState.activeArea === 'search_filters' && AppState.searchFilterRowIndex === 1 && i === AppState.searchFilterColIndex);
    var classes = 'filter-tab';
    if (isSelected) classes += ' active';
    if (isFocused) classes += ' focused';
    html += '    <div class="' + classes + '" style="font-size: 13px; padding: 0 15px; height: 26px; line-height: 24px; margin-right: 8px;" id="search-filter-r1-c' + i + '">' + genresList[i] + '</div>';
  }
  html += '  </div>';
  html += '</div>';

  // Row 2: Release Year
  html += '<div class="filter-row-container" style="height: 30px; line-height: 30px; margin-bottom: 8px;">';
  html += '  <span class="filter-row-label" style="width: 100px; font-size: 13px;">Year:</span>';
  html += '  <div class="filter-row-items">';
  for (var i = 0; i < yearsList.length; i++) {
    var isSelected = (i === AppState.selectedSearchYearIdx);
    var isFocused = (AppState.activeArea === 'search_filters' && AppState.searchFilterRowIndex === 2 && i === AppState.searchFilterColIndex);
    var classes = 'filter-tab';
    if (isSelected) classes += ' active';
    if (isFocused) classes += ' focused';
    html += '    <div class="' + classes + '" style="font-size: 13px; padding: 0 15px; height: 26px; line-height: 24px; margin-right: 8px;" id="search-filter-r2-c' + i + '">' + yearsList[i] + '</div>';
  }
  html += '  </div>';
  html += '</div>';

  // Row 3: Origin
  html += '<div class="filter-row-container" style="height: 30px; line-height: 30px; margin-bottom: 8px;">';
  html += '  <span class="filter-row-label" style="width: 100px; font-size: 13px;">Origin:</span>';
  html += '  <div class="filter-row-items">';
  for (var i = 0; i < nationalitiesList.length; i++) {
    var isSelected = (i === AppState.selectedSearchNatIdx);
    var isFocused = (AppState.activeArea === 'search_filters' && AppState.searchFilterRowIndex === 3 && i === AppState.searchFilterColIndex);
    var classes = 'filter-tab';
    if (isSelected) classes += ' active';
    if (isFocused) classes += ' focused';
    html += '    <div class="' + classes + '" style="font-size: 13px; padding: 0 15px; height: 26px; line-height: 24px; margin-right: 8px;" id="search-filter-r3-c' + i + '">' + nationalitiesList[i] + '</div>';
  }
  html += '  </div>';
  html += '</div>';

  container.innerHTML = html;
}

// ==========================================================================
// SEARCH MODULE
// ==========================================================================
function handleKeyboardPress(action) {
  var textEl = getEl('search-input-text');

  if (action === 'BACKSPACE') {
    if (searchQuery.length > 0) searchQuery = searchQuery.substring(0, searchQuery.length - 1);
  } else if (action === 'CLEAR') {
    searchQuery = "";
  } else {
    if (searchQuery.length < 30) searchQuery += action;
  }

  if (searchQuery.length === 0) {
    textEl.innerHTML = "Digite para buscar...";
    textEl.style.color = '#96A3B8';
  } else {
    textEl.innerHTML = searchQuery;
    textEl.style.color = '#5FFBFF';
  }
  
  if (searchTimeout) clearTimeout(searchTimeout);
  searchTimeout = setTimeout(function() {
    executeSearch();
  }, 500);
}

function hasSearchResults() {
  var results = getFilteredResults();
  return results.length > 0;
}

function getFilteredResults() {
  var query = searchQuery.toLowerCase();

  // Return empty if nothing typed and no filter active
  if (query.length === 0 && AppState.selectedSearchTypeIdx === 0 && AppState.selectedSearchGenreIdx === 0 && AppState.selectedSearchYearIdx === 0 && AppState.selectedSearchNatIdx === 0) {
    return [];
  }
  
  var allMedia = [];
  var type = searchTypesList[AppState.selectedSearchTypeIdx];
  if (type === 'All') {
    allMedia = MEDIA_CATALOG.animes.concat(MEDIA_CATALOG.series).concat(MEDIA_CATALOG.movies);
  } else if (type === 'Anime') {
    allMedia = MEDIA_CATALOG.animes;
  } else if (type === 'Series') {
    allMedia = MEDIA_CATALOG.series;
  } else if (type === 'Movies') {
    allMedia = MEDIA_CATALOG.movies;
  }
  
  var targetGenre  = genresList[AppState.selectedSearchGenreIdx];
  var targetYear   = yearsList[AppState.selectedSearchYearIdx];
  var targetNat    = nationalitiesList[AppState.selectedSearchNatIdx];
  var filtered = [];
  
  for (var i = 0; i < allMedia.length; i++) {
    var media = allMedia[i];
    
    // Match text query
    var matchText = true;
    if (query.length > 0) {
      matchText = (media.title.toLowerCase().indexOf(query) !== -1);
    }
    
    // Match genre
    var matchGenre = (targetGenre === 'Tudo');
    if (media.genres && targetGenre !== 'Tudo') {
      for (var g = 0; g < media.genres.length; g++) {
        if (media.genres[g] === targetGenre) {
          matchGenre = true;
          break;
        }
      }
    }
    
    // Match year range
    var matchYear = (targetYear === 'Tudo');
    if (targetYear !== 'Tudo') {
      matchYear = matchYearRange(media.year, targetYear);
    }

    // Match nationality
    var matchNat = (targetNat === 'Tudo');
    if (targetNat !== 'Tudo' && media.nationality === targetNat) {
      matchNat = true;
    }
    
    if (matchText && matchGenre && matchYear && matchNat) {
      // Evita duplicatas
      var isDuplicate = false;
      for (var j = 0; j < filtered.length; j++) {
        if (filtered[j].id === media.id) isDuplicate = true;
      }
      if (!isDuplicate) filtered.push(media);
    }
  }
  return filtered;
}

function executeSearch() {
  var listContainer = getEl('search-results-list');
  var results = getFilteredResults();

  if (searchQuery.length === 0 && AppState.selectedSearchTypeIdx === 0 && AppState.selectedSearchGenreIdx === 0 && AppState.selectedSearchYearIdx === 0 && AppState.selectedSearchNatIdx === 0) {
    listContainer.innerHTML = '<div class="search-no-results">Use the keyboard to search or select filters on the right.</div>';
    return;
  }

  if (results.length === 0) {
    listContainer.innerHTML = '<div class="search-no-results">No titles found for the selected criteria.</div>';
    return;
  }
  
  var html = '';
  for (var i = 0; i < results.length; i++) {
    var item = results[i];
    html += '<div class="result-item fade-in-el" id="result-' + i + '" data-index="' + i + '">';
    html += '  <div class="result-thumb" style="background-image: url(' + item.backdrop + ')"></div>';
    html += '  <div class="result-info">';
    html += '    <div class="result-title">' + item.title + '</div>';
    html += '    <div class="result-meta">Year: ' + item.year + ' · Rating: ★ ' + (item.rating || '9.0') + ' · Local Media</div>';
    html += '  </div>';
    html += '</div>';
  }
  listContainer.innerHTML = html;
}

// ==========================================================================
// FULL-SCREEN VIDEO PLAYER & SUBTITLE SYNC
// ==========================================================================
function playVideo(videoUrl, title, startTime) {
  var playerView = getEl('view-player');
  var video = getEl('kuraPlayer');
  var source = getEl('playerSource');
  var titleEl = getEl('player-media-title');
  
  titleEl.innerHTML = title;
  
  video.pause();
  source.setAttribute('src', videoUrl);
  video.load();
  
  if (startTime) {
    try {
      video.currentTime = startTime;
    } catch(e) {
      console.log("Could not set main video currentTime: " + e.message);
    }
  }
  
  playerView.className += ' active';
  AppState.activeArea = 'player';
  
  showPlayerControls();
  
  subtitleData = [];
  currentSubtitleIndex = -1;
  getEl('subtitles').innerHTML = '';
  
  // Load subtitles based on selected option
  if (AppState.subtitleIndex !== 2) { // 2 = No Subtitles
    loadMockSubtitles();
  }
  
  video.addEventListener('timeupdate', updatePlaybackProgress);
  video.addEventListener('ended', closePlayer);
  
  video.play();
}

function handlePlayerControl(key) {
  var video = getEl('kuraPlayer');
  showPlayerControls();
  
  if (key === 8 || key === 27 || key === 461) {
    closePlayer();
  } 
  else if (key === 13 || key === 32) {
    if (video.paused) video.play();
    else video.pause();
  } 
  else if (key === 39) {
    try {
      video.currentTime = Math.min(video.duration, video.currentTime + 10);
    } catch(e) {
      console.log("Could not seek forward: " + e.message);
    }
  } 
  else if (key === 37) {
    try {
      video.currentTime = Math.max(0, video.currentTime - 10);
    } catch(e) {
      console.log("Could not seek backward: " + e.message);
    }
  }
}

function showPlayerControls() {
  var controls = getEl('player-controls');
  if (controls) controls.className = 'player-controls';
  
  if (playerControlsTimeout) clearTimeout(playerControlsTimeout);
  playerControlsTimeout = setTimeout(function() {
    if (AppState.activeArea === 'player') {
      var video = getEl('kuraPlayer');
      if (!video.paused) {
        controls.className = 'player-controls hidden';
      }
    }
  }, 4000);
}

function updatePlaybackProgress() {
  var video = getEl('kuraPlayer');
  var progress = getEl('player-progress');
  var current = getEl('player-current-time');
  var total = getEl('player-total-time');
  
  if (!video || !video.duration) return;
  
  var percent = (video.currentTime / video.duration) * 100;
  progress.style.width = percent + '%';
  
  current.innerHTML = formatTime(video.currentTime);
  total.innerHTML = formatTime(video.duration);
  
  if (AppState.subtitleIndex !== 2) {
    syncSubtitles(video.currentTime);
  }
}

function formatTime(sec) {
  if (isNaN(sec)) return "00:00";
  var m = Math.floor(sec / 60);
  var s = Math.floor(sec % 60);
  return (m < 10 ? '0' + m : m) + ':' + (s < 10 ? '0' + s : s);
}

function closePlayer() {
  var video = getEl('kuraPlayer');
  var playerView = getEl('view-player');
  var playbackTime = 0;
  
  if (video) {
    playbackTime = video.currentTime;
    video.pause();
    video.removeEventListener('timeupdate', updatePlaybackProgress);
    video.removeEventListener('ended', closePlayer);
  }
  
  if (playerView) playerView.className = playerView.className.replace(' active', '');
  
  // Retorna para a tela de detalhes e sincroniza o PiP
  AppState.activeArea = 'details';
  hideAllViews();
  getEl('view-details').className = 'view active';
  
  var pipVideo = getEl('kuraPipPlayer');
  if (pipVideo) {
    try {
      pipVideo.currentTime = playbackTime;
    } catch(e) {
      console.log("Could not set pip currentTime: " + e.message);
    }
    try {
      pipVideo.play();
    } catch(e) {
      console.log("Could not play pip: " + e.message);
    }
  }
  
  updateFocusState();
}

function loadMockSubtitles() {
  var mockSRT = 
    "1\n00:00:01,500 --> 00:00:04,500\n[Kura Media]\nLegenda sincronizada para a Bravia.\n\n" +
    "2\n00:00:06,000 --> 00:00:09,800\nDesde o dia em que o portal se abriu,\no mundo mudou drasticamente.\n\n" +
    "3\n00:00:11,500 --> 00:00:15,000\nAlgumas pessoas ganharam poderes estranhos.\nEles são os caçadores.\n\n" +
    "4\n00:00:17,200 --> 00:00:20,500\nMas para mim, Sung Jin-woo...\no portal trouxe apenas dor.\n\n" +
    "5\n00:00:22,000 --> 00:00:25,800\nEu sou o caçador mais fraco da humanidade.\nE hoje é meu último dia de fraqueza.";
  
  parseSRTContent(mockSRT);
}

function parseSRTContent(data) {
  subtitleData = [];
  var cleanData = data.replace(/\r/g, '');
  var items = cleanData.split('\n\n');
  
  for (var i = 0; i < items.length; i++) {
    var lines = items[i].split('\n');
    if (lines.length >= 3) {
      var timeLine = lines[1];
      var text = lines.slice(2).join('<br>');
      
      var times = timeLine.split(' --> ');
      if (times.length === 2) {
        subtitleData.push({
          start: srtTimeToSeconds(times[0]),
          end: srtTimeToSeconds(times[1]),
          text: text
        });
      }
    }
  }
}

function srtTimeToSeconds(t) {
  var parts = t.split(':');
  var secParts = parts[2].split(',');
  return (parseInt(parts[0], 10) * 3600) + 
         (parseInt(parts[1], 10) * 60) + 
         parseInt(secParts[0], 10) + 
         (parseInt(secParts[1], 10) / 1000);
}

function syncSubtitles(currentTime) {
  var text = "";
  for (var i = 0; i < subtitleData.length; i++) {
    var sub = subtitleData[i];
    if (currentTime >= sub.start && currentTime <= sub.end) {
      text = sub.text;
      break;
    }
  }
  
  var subContainer = getEl('subtitles');
  if (subContainer && subContainer.innerHTML !== text) {
    subContainer.innerHTML = text;
  }
}
