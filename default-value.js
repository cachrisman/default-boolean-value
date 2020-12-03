window.contentfulExtension.init(function (extension) {

  extension.window.startAutoResizer();

  var trueRadioElm = document.getElementById('trueRadio');
  var falseRadioElm = document.getElementById('falseRadio');
  var defaultValue = extension.parameters.instance.defaultValue;
  var readOnly = extension.parameters.instance.readOnly;
  var isFirstVersion = extension.entry.getSys().version === 1;
  var fieldId = extension.field.id;
  var fieldValue = extension.field.getValue();
  var detachValueChangeHandler = null;

  if (!readOnly) {
    detachValueChangeHandler = extension.field.onValueChanged(valueChangeHandler);
    trueRadioElm.addEventListener('change', changeHandler);
    falseRadioElm.addEventListener('change', changeHandler);
    window.addEventListener('onbeforeunload', unloadHandler);
  } else {
    trueRadioElm.setAttribute('disabled', 'disabled');
    falseRadioElm.setAttribute('disabled', 'disabled');
  }

  console.log(`fieldValue: ${fieldValue}`);
  console.log(`defaultValue: ${defaultValue}`);
  console.log(`readOnly: ${readOnly}`);

  document.getElementById('defaultValue').appendChild(document.createTextNode(defaultValue));

  if ((isFirstVersion || readOnly) && fieldValue === undefined) {
    setFieldValue(defaultValue, true);
  } else if (fieldValue !== undefined) {
    setRadioValue(fieldValue);
  }

  function valueChangeHandler(value) {
    console.log(`valueChangeHandler(value), value: ${value}`);
    setRadioValue(value);
  }

  function changeHandler() {
    var value = this.value === 'true';
    console.log(`changeHandler(value), value: ${value}`);
    setFieldValue(value, false);
  }

  function setFieldValue(value, shouldSetRadioValue) {
    console.log(`setFieldValue(value), value: ${value}`);
    extension.field.setValue(value).then((value) => {
      if (shouldSetRadioValue) {
        setRadioValue(value);
      }
      console.log(`set '${value}' on field '${fieldId}'`);
    }).catch((err) => {
      console.log(`error setting value on field '${fieldId}'`);
      console.log(err);
    });
  }

  function setRadioValue(bool) {
    trueRadioElm.checked = bool;
    falseRadioElm.checked = !bool;
  }

  function unloadHandler() {
    window.removeEventListener('onbeforeunload', unloadHandler);
    trueRadioElm.removeEventListener('change', changeHandler);
    falseRadioElm.removeEventListener('change', changeHandler);
    detachValueChangeHandler();
  }

});
