function ImageInput(element){
  // Variables
  var $wrapper = element;
  var $file = $wrapper.querySelector('input[type=file]');
  var $input = $wrapper.querySelector('input[type=hidden]');
  var $img = $wrapper.querySelector('img');
  var maxSize = Number($file.getAttribute('max-size'));
  var types = $file.accept.split(',');

  var api = {
    onInvalid: onInvalid,
    onChanged: onChanged,
  };

  // Methods
  function fileHandler(e) {
      var file = $file.files.length && $file.files[0];

      if(!file) return;

      var errors = checkValidity(file);

      if(errors) {
        api.onInvalid(errors);
        $file.value = null;
        return;
      }

      api.onChanged(file, update, $wrapper)
  }

  function humanizeFormat(string) {
    return string.replace(/.*?\//, '');
  }

  function checkValidity(file) {
    var errors = [];

    types.includes(file.type) || errors.push('Format file harus: ' + types.map(humanizeFormat).join(', '));
    file.size < maxSize || errors.push('Ukuran file maksimal ' + maxSize/1000000 + 'MB');

    return errors.length ? errors : false;
  }

  function getFileData(file, callback) {
    var reader  = new FileReader();

    reader.addEventListener("load", function () {
      callback(reader.result);
    }, false);

    if (file) {
      reader.readAsDataURL(file);
    }
  }

  function update(data) {
    $img.src = data;
    $input.value = data;
  }

  function onInvalid(errors) {
    alert(errors.join('. '));
  }

  function onChanged(file, update, $wrapper) {
    console.log('.onChanged called');
    getFileData(file, update);
  }

  // Init
  $file.addEventListener('change', fileHandler);

  return api;
};

document.querySelectorAll('.image-input').forEach(_ => {
  var imageInput = new ImageInput(_);
  _.addEventListener("click",(e)=>{
     if(e.target.classList.contains('image-remove')) {
       _.remove()
     }
   });



  if(_.classList.contains('withAjax')) {
    imageInput.onChanged = customOnChanged;

  }

  function customOnChanged(file, update, $el) {
    if(!$el.nextElementSibling){
      var $remove = document.createElement('button');
      $remove.className = "image-remove";

      var $new = $el.cloneNode(true);
      $new.querySelector('input[type=hidden]').value = "";
      $new.querySelector('input[type=file]').value = "";
      $new.querySelector('img').src = "";

      $el.parentElement.append($new);
      $el.append($remove);

      var imageInput = new ImageInput($new);
      imageInput.onChanged = customOnChanged;
    }

    $el.classList.add('isUploading');
    setTimeout(function() {
      update('https://placekitten.com/200/300');
      $el.classList.remove("isUploading");
    }, 3000);

  };

});