var unsaved_images = [];
var viewer_state = "none";
var db = window.localStorage;


function convertUrl(url){
    return url.split(".").join("");
    
}
function createCookies(arr, caption){
    var index;
    
    for (index = 0; index < arr.length; index++){
    
        //intel.xdk.cache.setCookie(arr[index],caption,10);
        db.setItem(arr[index], caption);
    }
}
function purge(){
    var imagePanel = document.getElementById("image_column");
    while (imagePanel.firstChild){
        imagePanel.removeChild(imagePanel.firstChild);
    }
}
function showAll(){
    var imagePanel = document.getElementById("image_column_gallery");
    while (imagePanel.firstChild){
        imagePanel.removeChild(imagePanel.firstChild);
    }
    var imagesArray = intel.xdk.camera.getPictureList();
    for (var i = 0; i < imagesArray.length; i++){
        var image = document.createElement('img');
        image.src = intel.xdk.camera.getPictureURL(imagesArray[i]);
        document.getElementById("image_column_gallery").appendChild(image);
        var figcaption = document.createElement("figcaption");
        figcaption.innerHTML = db.getItem(convertUrl(image.src));
        //intel.xdk.cache.getCookie(convertUrl(image.src));
        document.getElementById("image_column_gallery").appendChild(figcaption);
    }
}
document.addEventListener("intel.xdk.camera.picture.add",onSuccess); 
document.addEventListener("intel.xdk.camera.picture.busy",onSuccess); 
document.addEventListener("intel.xdk.camera.picture.cancel",onSuccess); 

function capturePhoto() {
  intel.xdk.camera.takePicture(80, true, "jpg");
}

function onSuccess(evt) {

  if (evt.success === true)
  {
    // create image 
    console.log("TOOK A PICTURE");
    var image = document.createElement('img');
    image.src=intel.xdk.camera.getPictureURL(evt.filename);
    image.id=evt.filename;
    document.getElementById("image_column").appendChild(image);
    //console.log(image.src);
    //console.log(convertUrl(image.src));
    unsaved_images[unsaved_images.length] = convertUrl(image.src);
    //document.getElementById("caption-box").value = image.src;
    //document.getElementById("image_panel").src = intel.xdk.camera.getPictureURL(evt.filename);
  }
  else
  {
    if (evt.message !== undefined)
    {
        alert(evt.message);
    }
    else
    {
        alert("error capturing picture");
    }
  }
}
(function()
{
 "use strict";
 /*
   hook up event handlers 
 */
 function register_event_handlers()
 {
    
    
     /* button  #camera_button */
    $(document).on("click", "#camera_button", function(evt)
    {
        /* your code goes here */
        capturePhoto();
        //document.write("hello");
    });
    
        /* button  #camera-page-button */
    $(document).on("click", "#camera-page-button", function(evt)
    {
         activate_subpage("#page_34_7"); 
    });
    
        /* button  #gallery-page-button */
    $(document).on("click", "#gallery-page-button", function(evt)
    {
         activate_subpage("#viewer_page"); 
    });
    
        /* graphic button  #all-images */
    $(document).on("click", "#all-images", function(evt)
    {
        /* your code goes here */
        if (viewer_state != "all"){
            showAll();
        }
    });
    
        /* button  #save_button */
    $(document).on("click", "#save_button", function(evt)
    {
        /* your code goes here */
        var caption_box = document.getElementById("caption-box");
        var caption_value = caption_box.value;
        console.log("flag 1");
        createCookies(unsaved_images, caption_value);
        purge();
        unsaved_images = [];
        console.log(intel.xdk.cache.getCookieList().toString());
    });
    
    }
 document.addEventListener("app.Ready", register_event_handlers, false);
})();
