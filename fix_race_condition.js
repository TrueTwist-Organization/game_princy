const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'explore', 'game');
const files = fs.readdirSync(directoryPath).filter(f => f.endsWith('.php'));

const cleanSinglePushHeadScript = `  <script>
    window.googletag = window.googletag || { cmd: [] };

    let interstitialSlot, rewardedSlot, bannerSlot1, bannerSlot2, bannerSlot3;

    // Auto-pop the rewarded ad after 2 seconds
    setTimeout(() => {
        if (typeof window.makeRewardedVisible === 'function') {
            window.makeRewardedVisible();
            window.makeRewardedVisible = null;
        } else {
            window.autoPopRequested = true;
        }
    }, 2000);

    let interShown = false;
    let rewardedCallback = null;
    let rewardEarned = false;

    googletag.cmd.push(() => {
      // 1. Define out-of-page slots
      interstitialSlot = googletag.defineOutOfPageSlot(
        '/21775744923/example/interstitial',
        googletag.enums.OutOfPageFormat.INTERSTITIAL
      );
      if (interstitialSlot) interstitialSlot.addService(googletag.pubads());

      rewardedSlot = googletag.defineOutOfPageSlot(
        '/21775744923/example/rewarded',
        googletag.enums.OutOfPageFormat.REWARDED
      );
      if (rewardedSlot) rewardedSlot.addService(googletag.pubads());

      const anchorSlot = googletag.defineOutOfPageSlot(
        '/21775744923/example/anchor',
        googletag.enums.OutOfPageFormat.BOTTOM_ANCHOR
      );
      if (anchorSlot) anchorSlot.addService(googletag.pubads());

      // 2. Define standard banner slots in the head
      bannerSlot1 = googletag.defineSlot('/21775744923/example/banner', [[336, 280], [728, 90], 'fluid'], 'div-gpt-ad-1765209918424-0');
      if (bannerSlot1) bannerSlot1.addService(googletag.pubads());

      bannerSlot2 = googletag.defineSlot('/21775744923/example/banner', [[336, 280], [728, 90], 'fluid'], 'div-gpt-ad-1765277076482-0');
      if (bannerSlot2) bannerSlot2.addService(googletag.pubads());

      bannerSlot3 = googletag.defineSlot('/21775744923/example/banner', [[336, 280], [728, 90], 'fluid'], 'div-gpt-ad-1765277171699-0');
      if (bannerSlot3) bannerSlot3.addService(googletag.pubads());

      // 3. Register rewarded ad listeners (MUST be done before enableServices to avoid race conditions!)
      googletag.pubads().addEventListener('rewardedSlotReady', function(event) {
        window.makeRewardedVisible = function(callback) {
          rewardEarned = false;
          rewardedCallback = callback;
          event.makeRewardedVisible();
        };
        if (window.autoPopRequested) {
             event.makeRewardedVisible();
        }
      });

      googletag.pubads().addEventListener('rewardedSlotGranted', function(event) {
        window.location.hash = "goog_rewarded";
        rewardEarned = true;
      });

      googletag.pubads().addEventListener('rewardedSlotClosed', function(event) {
        if (rewardedCallback) {
          rewardedCallback();
        }
        rewardedCallback = null;
        
        if (rewardedSlot) {
          googletag.destroySlots([rewardedSlot]);
          rewardedSlot = googletag.defineOutOfPageSlot('/21775744923/example/rewarded', googletag.enums.OutOfPageFormat.REWARDED);
          if (rewardedSlot) {
              rewardedSlot.addService(googletag.pubads());
              googletag.display(rewardedSlot);
          }
        }
      });

      // 4. Configure pubads, enable services and display slots
      googletag.pubads().enableSingleRequest();
      googletag.pubads().setTargeting("ad_impression", window.AD_IMPRESSION || "default");
      googletag.enableServices();
      
      // display the out-of-page slots
      if (rewardedSlot) {
        googletag.display(rewardedSlot);
      }
    });

    function showInterstitialOnce(callback) {
      if (interShown) {
        callback && callback();
        return;
      }
      interShown = true;
      googletag.cmd.push(() => {
        if (interstitialSlot) googletag.display(interstitialSlot);
        setTimeout(() => { callback && callback(); }, 700);
      });
    }

    function showRewardedAd(callback) {
      if (typeof window.makeRewardedVisible === 'function') {
        window.makeRewardedVisible(callback);
        window.makeRewardedVisible = null;
        return true;
      }
      return false;
    }
  </script>\n`;

let count = 0;
for (const file of files) {
    const filePath = path.join(directoryPath, file);
    let content = fs.readFileSync(filePath, 'utf8');

    // Find the start and end of the script block we need to replace
    const startIdx = content.indexOf('window.googletag = window.googletag || { cmd: [] };');
    if (startIdx !== -1) {
        const scriptStart = content.lastIndexOf('<script>', startIdx);
        const scriptEnd = content.indexOf('</script>', startIdx);
        // Find the full end of the block containing showRewardedAd definition
        const fullEndIndex = content.indexOf('</script>', content.indexOf('function showRewardedAd(callback) {'));
        
        if (scriptStart !== -1 && fullEndIndex !== -1) {
            content = content.substring(0, scriptStart) + cleanSinglePushHeadScript + content.substring(fullEndIndex + 9);
            fs.writeFileSync(filePath, content, 'utf8');
            count++;
        }
    }
}

console.log(`Successfully refactored head scripts to single-push in ${count} PHP pages.`);
