"use client";


import { HtmlEditor, Image, Inject, Link, QuickToolbar, RichTextEditorComponent, Toolbar } from '@syncfusion/ej2-react-richtexteditor';
import { Form, Skeleton, Spin } from 'antd';
import * as React from 'react';
function Editor() {
  const form = Form.useFormInstance();
  const [loading, setLoading] = React.useState(true);
  const [value, setValue] = React.useState("");
  const toolbarSettings = {
    items: ['Bold', 'Italic', 'Underline', 'StrikeThrough',
      'FontName', 'FontSize', 'FontColor', 'BackgroundColor',
      'LowerCase', 'UpperCase', '|',
      'Formats', 'Alignments', 'OrderedList', 'UnorderedList',
      'Outdent', 'Indent', '|',
      'CreateLink', 'Image', '|', 'ClearFormat', 'Print',
      'SourceCode', 'FullScreen', '|', 'Undo', 'Redo']
  };
  const quickToolbarSettings = {
    image: ['Replace', 'Align', 'Caption', 'Remove', 'InsertLink', 'OpenImageLink', '-', 'EditImageLink', 'RemoveImageLink', 'Display', 'AltText', 'Dimension'],
    link: ['Open', 'Edit', 'UnLink']
  };
  React.useEffect(() => {
    form.setFieldValue("editor", value);
  }, [value]);
  React.useEffect(() => {
    function removeAllChildNodes(parent: any) {
      while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
      }
    }
    var me = document
      .querySelector('a[href="https://www.syncfusion.com/account/claim-license-key?pl=SmF2YVNjcmlwdA==&vs=MjY=&utm_source=es_license_validation_banner&utm_medium=listing&utm_campaign=license-information"]');
    me?.parentNode?.parentNode?.removeChild(me?.parentNode);
    setTimeout(() => {
      var a = form.getFieldValue("editor");
      setValue(a);
      setLoading(false);
    }, 1000)
  }, []);
  return (
    <Spin spinning={loading}>
      <RichTextEditorComponent value={value} onBlur={(e: any) => {
        setValue(e.target.innerHTML);
      }} height={450} toolbarSettings={toolbarSettings} quickToolbarSettings={quickToolbarSettings}>
        <Inject services={[Toolbar, Image, Link, HtmlEditor, QuickToolbar]} />
      </RichTextEditorComponent>
    </Spin>
  );
}
export default Editor;