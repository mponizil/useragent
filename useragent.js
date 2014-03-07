(function (root, factory) {
  if (typeof define === 'function' && define.amd) define('useragent', factory);
  else root.UA = factory();
}(this, function() {

  function parse(navigator) {
    var browser, os, osVersion, version,
        navigator = navigator || window.navigator,
        ua = navigator.userAgent,
        platform = navigator.platform;

    if (/MSIE/.test(ua)) {
      browser = 'MSIE';
      if (/IEMobile/.test(ua)) browser += ' Mobile';
      version = /MSIE \d+[.]\d+/.exec(ua)[0].split(' ')[1];
    } else if (/Trident/.test(ua)) {
      browser = 'MSIE';
      version = /rv:\d+[.]\d+/.exec(ua)[0].split(':')[1];
    } else if (/Chrome/.test(ua)) {
      browser = 'Chrome';
      version = /Chrome\/[\d\.]+/.exec(ua)[0].split('/')[1];
    } else if (/Opera/.test(ua)) {
      browser = 'Opera';
      if (/mini/.test(ua)) browser += ' Mini';
      else if (/Mobile/.test(ua)) browser += ' Mobile';
    } else if (/Android/.test(ua)) {
      browser = 'Android Webkit Browser';
      mobile = true;
      os = /Android\s[\.\d]+/.exec(ua);
    } else if (/Firefox/.test(ua)) {
      browser = 'Firefox';
      if (/Fennec/.test(ua)) browser += ' Mobile';
      version = /Firefox\/[\.\d]+/.exec(ua)[0].split('/')[1];
    } else if (/Safari/.test(ua)) {
      browser = 'Safari';
      if ((/iPhone/.test(ua)) || (/iPad/.test(ua)) || (/iPod/.test(ua))) os = 'iOS';
    } else {
      browser = 'MSIE';
    }
    if (!version) {
       version = /Version\/[\.\d]+/.exec(ua);
       if (version) version = version[0].split('/')[1];
       else if (browser == 'Opera') version = /Opera\/[\.\d]+/.exec(ua)[0].split('/')[1]
       else version = '6.0';
    }
    if (platform === 'MacIntel' || platform === 'MacPPC') {
      os = 'Mac OS X';
      osVersion = /10[\.\_\d]+/.exec(ua);
      if (osVersion) os += ' ' + osVersion[0];
      if (/[\_]/.test(os)) os = os.split('_').join('.');
    } else if (platform === 'Win32') {
      os = 'Windows 32 bit';
    } else if (platform == 'Win64') {
      os = 'Windows 64 bit';
    } else if (!os && /Linux/.test(platform)) {
      os = 'Linux';
    } else if (!os && /Windows/.test(ua)) {
      os = 'Windows';
    } else {
      os = 'Windows';
    }

    return [browser, version, os, osVersion];
  };

  var UA = {

    reset: function(navigator) {
      this.set.apply(this, parse(navigator));
      return this;
    },

    set: function(browser, version, os, osVersion) {
      version = version || 0;
      os = os || '';
      osVersion = osVersion || 0;

      var slimVersion = Math.floor(parseFloat(version)),
          slimOs = os.split(' ')[0],
          slimOsVersion = Math.floor(parseFloat(osVersion));

      this.browser = browser;
      this.version = version;
      this.slimVersion = slimVersion;
      this.os = os;
      this.slimOs = slimOs;
      this.osVersion = osVersion;
      this.slimOsVersion = slimOsVersion;

      // Out with the old.
      for (key in this.is) {
        if (this.is.hasOwnProperty(key)) delete this.is[key];
      }

      // And in with the new.
      var self = this;
      var browserId = browser.toLowerCase().split(' ')[0];
      this.is[browserId] = function(v) {
        return (v === self.version || v === self.slimVersion || v === undefined);
      };
    },

    is: {}

  };

  return UA.reset();

}));
