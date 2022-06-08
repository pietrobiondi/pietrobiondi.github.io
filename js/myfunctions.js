function showhidelist() {
   var dots = document.getElementById("dots");
   var moreText = document.getElementById("more");
   var btnText = document.getElementById("myBtn");

   if (dots.style.display === "none") {
     dots.style.display = "inline";
     btnText.innerHTML = "Read more"; 
     moreText.style.display = "none";
  } else {
     dots.style.display = "none";
     btnText.innerHTML = "Read less"; 
     moreText.style.display = "inline";
  }
}

function showhidelist_pub() {
   var dots = document.getElementById("dots_pub");
   var moreText = document.getElementById("more_pub");
   var btnText = document.getElementById("myBtn_pub");

   if (dots.style.display === "none") {
     dots.style.display = "inline";
     btnText.innerHTML = "Read more"; 
     moreText.style.display = "none";
  } else {
     dots.style.display = "none";
     btnText.innerHTML = "Read less"; 
     moreText.style.display = "inline";
  }
}

function showhidelist_media() {
   var dots = document.getElementById("dots_media");
   var moreText = document.getElementById("more_media");
   var btnText = document.getElementById("myBtn_media");

   if (dots.style.display === "none") {
     dots.style.display = "inline";
     btnText.innerHTML = "Read more"; 
     moreText.style.display = "none";
  } else {
     dots.style.display = "none";
     btnText.innerHTML = "Read less"; 
     moreText.style.display = "inline";
  }
}