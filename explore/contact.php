<?php
// CONTACT PAGE
?>
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="Contact GamerZone">
  <title>Contact Us | GamerZone</title>
  <style>
    body {
      background-color: #f8f8ff;
      font-family: Arial, sans-serif;
      font-size: 12px;
      /* small text */
      line-height: 1.5;
      color: #000;
      padding: 20px;
      margin: 0;

    }

    h1 {
      font-size: 20px;
      margin-bottom: 10px;
    }

    p {
      margin: 0.5em 0;
    }

    a {
      color: #0000EE;
      text-decoration: none;
    }

    a:hover {
      text-decoration: underline;
    }

    /* Back to Home button styling */
    .btn-home {
      display: inline-block;
      margin-top: 20px;
      padding: 8px 16px;
      background-color: #8282ff;
      color: #fff;
      font-size: 12px;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      text-decoration: none;
    }

    .btn-home:hover {
      background-color: #3333FF;
    }

    /* Optional ad placeholder styling */
    .ad-placeholder {
      background-color: #ffffff;
      color: #000;
      text-align: center;
      padding: 10px;
      margin: 20px 0;
      border: 1px dashed #000;
    }
  </style>
  <script>
    window.googletag = window.googletag || { cmd: [] };

    let interstitialSlot;
    let interShown = false; // ✅ per page sirf 1 ad

    googletag.cmd.push(() => {
      interstitialSlot = googletag.defineOutOfPageSlot(
        '/269265836/GamerZone_display_Inter',
        googletag.enums.OutOfPageFormat.INTERSTITIAL
      );

      if (interstitialSlot) {
        interstitialSlot.addService(googletag.pubads());
      }

      googletag.pubads().setTargeting("ad_impression", window.AD_IMPRESSION);
      googletag.enableServices();
    });

    function showInterstitialOnce(callback) {
      if (interShown) {
        callback && callback();
        return;
      }

      interShown = true;

      googletag.cmd.push(() => {
        if (interstitialSlot) {
          googletag.display(interstitialSlot);
        }

        // ⏱ fallback so page never blocks
        setTimeout(() => {
          callback && callback();
        }, 700);
      });
    }
  </script>
</head>

<body>
  <script>
    document.addEventListener(
      "click",
      function () {
        showInterstitialOnce();
      },
      { once: true } // ✅ sirf first click
    );
  </script>

  <h1>Contact Us</h1>
  <p>Got a question or want to share your thoughts? We’d love to hear from you!</p>
  <p>Drop us a line at <a href="mailto:contact@gamerzone.com">contact@gamerzone.com</a> and we’ll get back to you
    as soon as we can.</p>
  <p>Your feedback helps make hyygames even better. Thanks for being part of our community!</p>



  <!-- Back to Home Button -->
  <a href="../index.php" class="btn-home">Back to Home</a>
</body>

</html>