const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'explore', 'game');
const files = fs.readdirSync(directoryPath).filter(f => f.endsWith('.php'));

const newScriptBlock = `  <script>
    window.googletag = window.googletag || { cmd: [] };

    let interstitialSlot, rewardedSlot, bannerSlot1, bannerSlot2, bannerSlot3;

    // Auto-pop the rewarded ad after 2 seconds
    setTimeout(() => {
        const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
        if (isLocal) {
            showFallbackRewarded();
        } else {
            if (typeof window.makeRewardedVisible === 'function') {
                window.makeRewardedVisible();
                window.makeRewardedVisible = null;
            } else {
                window.autoPopRequested = true;
                // If real ad doesn't load in 1.5 more seconds (total 3.5s), show the fallback ad
                setTimeout(() => {
                    if (window.autoPopRequested) {
                        showFallbackRewarded();
                    }
                }, 1500);
            }
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
          window.autoPopRequested = false; // Disable fallback since real ad loaded!
          rewardEarned = false;
          rewardedCallback = callback;
          event.makeRewardedVisible();
        };
        if (window.autoPopRequested) {
             window.autoPopRequested = false;
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

    function showFallbackRewarded(callback) {
        const modal = document.getElementById("fallback-rewarded-modal");
        const timer = document.getElementById("fallback-rewarded-timer");
        const closeBtn = document.getElementById("close-fallback-rewarded");
        const video = document.getElementById("fallback-rewarded-video");
        
        if (modal && timer && closeBtn) {
            modal.style.display = "flex";
            if (video) {
                video.play().catch(e => console.log("Video play blocked:", e));
            }
            
            let timeLeft = 5;
            timer.innerHTML = \`Reward in \${timeLeft} seconds\`;
            
            const interval = setInterval(() => {
                timeLeft--;
                if (timeLeft > 0) {
                    timer.innerHTML = \`Reward in \${timeLeft} seconds\`;
                } else {
                    clearInterval(interval);
                    timer.innerHTML = \`Reward granted!\`;
                }
            }, 1000);
            
            closeBtn.onclick = () => {
                modal.style.display = "none";
                if (video) video.pause();
                clearInterval(interval);
                if (callback) callback();
            };
        } else {
            if (callback) callback();
        }
    }

    function showRewardedAd(callback) {
      const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      if (isLocal) {
        showFallbackRewarded(callback);
        return true;
      }
      if (typeof window.makeRewardedVisible === 'function') {
        window.makeRewardedVisible(callback);
        window.makeRewardedVisible = null;
        return true;
      } else {
        showFallbackRewarded(callback);
        return true;
      }
    }
  </script>`;

let count = 0;
for (const file of files) {
    const filePath = path.join(directoryPath, file);
    let content = fs.readFileSync(filePath, 'utf8');

    // Replace the old script block in the head
    const startIdx = content.indexOf('window.googletag = window.googletag || { cmd: [] };');
    if (startIdx !== -1) {
        const scriptStart = content.lastIndexOf('<script>', startIdx);
        const scriptEnd = content.indexOf('</script>', startIdx);
        const fullEndIndex = content.indexOf('</script>', content.indexOf('function showRewardedAd(callback) {'));
        
        if (scriptStart !== -1 && fullEndIndex !== -1) {
            content = content.substring(0, scriptStart) + newScriptBlock + content.substring(fullEndIndex + 9);
            fs.writeFileSync(filePath, content, 'utf8');
            count++;
        }
    }
}

console.log(`Successfully refactored scripts to prioritize localhost mode in ${count} PHP pages.`);
