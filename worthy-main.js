(function () {
  var tabs = { };
  var load = true;

  // Setup the button-action
  browser.browserAction.onClicked.addListener (function () {
    // Toggle the status
    load = !load;
    
    // Update the icon
    browser.browserAction.setIcon ({
      'path' : {
        '16' : 'assets/icon-16-' + (load ? 'en' : 'dis') + 'abled.png',
        '64' : 'assets/icon-64-' + (load ? 'en' : 'dis') + 'abled.png'
      }
    });
  });
  
  // Update the badge
  function badge (count, tabId) {
    browser.browserAction.setBadgeText ({ 'text' : (count > 0 ? count.toString () : ''), 'tabId' : tabId });
    browser.browserAction.setBadgeBackgroundColor ({ 'color' : (count > 1 ? '#800000' : '#008000'), 'tabId' : tabId });
  }
  
  // Reset a tabs state upon navigation
  browser.webNavigation.onBeforeNavigate.addListener (function (request) {
    tabs [request.tabId] = 0;
    badge (0, request.tabId);
  });
  
  // Collect/Filter webRequests for VG-Wort-Markers
  browser.webRequest.onBeforeRequest.addListener (
    function (request) {
      // Update the counter
      if (typeof tabs [request.tabId] == 'undefined')
        tabs [request.tabId] = 1;
      else
        tabs [request.tabId]++;
      
      // Update the button
      badge (tabs [request.tabId], request.tabId);
      
      // Check wheter to block the request
      if (!load)
        return {
          'cancel' : true
        };
    }, {
      urls: [ '*://*.met.vgwort.de/na/*' ],
      types: [ "image" ]
    }, [
      'blocking'
    ]
  );
})();
