import React, {useRef, useState} from "react";
import {
  HtmlEditor,
  Image,
  Inject,
  Link,
  QuickToolbar,
  RichTextEditorComponent,
  Toolbar,
} from "@syncfusion/ej2-react-richtexteditor";

import { EditorData } from "../data/dummy";
import { Header } from "../components";

import { useStateContext } from "../contexts/ContextProvider";
import {doc, setDoc, setLogLevel} from "firebase/firestore";
setLogLevel('debug');

const Notes = () => {
  const { user, getCollectionRef} = useStateContext();
  //console.log(user.uid); // confirmed grabbing right UID
  const editorRef = useRef(null);


  const handleSave = async () => {
    const editorInstance = editorRef.current; //This will access the rich text editor
    if (!editorInstance) {
      console.error("Editor Instance Not avaialble. Reload and try again?");//On page reload it seems to lose auth?? Ask rick.
      return;
    }

    console.log("UserID: ", user?.uid);
    try {
      const collectionRef = getCollectionRef();
      if(!collectionRef){
        console.error("No Collection Reference");
        return;
      }

      //populate string content to save
      const noteContent = editorInstance.getContent(); //gets content in richtext
      const stringContent = noteContent.innerText;
      console.log("Note Content: ", stringContent);
      
      //Create document reference under unique ID in correct collection
      const newData = doc(collectionRef);
      console.log("Document Reference: ", newData);

      //actually create document
      await setDoc(newData, {noteData: stringContent}); //if the collection doesn't exist at this point firestore implicitly creates it
      console.log("Document Added Successfully");
    }catch (error){
      console.error("Error Adding Doc: ", error);
    }
  };
  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
      <Header category="Apps" title="Notes" />
      <RichTextEditorComponent ref={editorRef} height={650}>
        <Inject services={[HtmlEditor, Toolbar, Image, Link, QuickToolbar]} />
      </RichTextEditorComponent>
      <button type="button" onClick={handleSave} >Save</button>
    </div>
  );
};

export default Notes;
