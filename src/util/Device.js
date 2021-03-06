class Device {
  /**
   * Public.
   * @param {String} [userAgent]
   */
  static userAgent (userAgent) {
    if (userAgent === undefined) {
      userAgent = navigator.userAgent;
    }

    userAgent = userAgent.toLowerCase();

    return userAgent;
  }

  /**
   * Public.
   * @param {String} pattern
   * @param {String} [userAgent]
   */
  static detect (pattern, userAgent) {
    return (pattern).test(Device.userAgent(userAgent));
  }

  /**
   * Public.
   */
  static device () {
    if (Device.isMobile()) {
      return 'mobile';
    }

    if (Device.isTablet()) {
      return 'tablet';
    }

    return 'desktop';
  }

  /**
   * Public.
   */
  static isDesktop () {
    return !(Device.isMobile() || Device.isTablet());
  }

  /**
   * Public.
   */
  static isMobile () {
    if (Device.isTablet()) {
      return false;
    }

    return Device.detect(/(mobi|ipod|phone|blackberry|opera mini|fennec|minimo|symbian|psp|nintendo ds|archos|skyfire|puffin|blazer|bolt|gobrowser|iris|maemo|semc|teashark|uzard)/);;
  }

  /**
   * Public.
   */
  static isTablet () {
    return Device.detect(/(ipad|tablet|(android(?!.*mobile))|(windows(?!.*phone)(.*touch))|kindle|playbook|silk|(puffin(?!.*(IP|AP|WP))))/);
  }

  /**
   * Public.
   */
  static isChrome () {
    return Device.detect(/webkit\W.*(chrome|chromium)\W/i);
  }

  /**
   * Public.
   */
  static isFirefox () {
    return Device.detect(/mozilla.*\Wfirefox\W/i);
  }

  /**
   * Public.
   */
  static isGecko () {
    return Device.detect(/mozilla(?!.*webkit).*\Wgecko\W/i);
  }

  /**
   * Public.
   */
  static isIE () {
    if (navigator.appName === 'Microsoft Internet Explorer') {
      return true;
    } else if (detect(/\bTrident\b/)) {
      return true;
    }

    return false;
  }

  /**
   * Public.
   */
  static isKindle () {
    return Device.detect(/\W(kindle|silk)\W/i);
  }

  /**
   * Public.
   */
  static isOpera () {
    return Device.detect(/opera.*\Wpresto\W|OPR/i);
  }

  /**
   * Public.
   */
  static isSafari () {
    return Device.detect(/webkit\W(?!.*chrome).*safari\W/i);
  }

  /**
   * Public.
   */
  static isTV () {
    return Device.detect(/googletv|sonydtv/i);
  }

  /**
   * Public.
   */
  static isWebKit () {
    return Device.detect(/webkit\W/i);
  }

  /**
   * Public.
   */
  static isAndroid () {
    return Device.detect(/android/i);
  }

  /**
   * Public.
   */
  static isIOS () {
    return Device.detect(/(ipad|iphone|ipod)/i);
  }

  /**
   * Public.
   */
  static isIPad () {
    return Device.detect(/ipad/i);
  }

  /**
   * Public.
   */
  static isIPhone () {
    return Device.detect(/iphone/i);
  }

  /**
   * Public.
   */
  static isIPod () {
    return Device.detect(/ipod/i);
  }
}