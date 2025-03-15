"use client";

import React, { useEffect, useRef } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Typography from "@tiptap/extension-typography";
import Link from "@tiptap/extension-link";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import Placeholder from "@tiptap/extension-placeholder";

import type { Extensions } from "@tiptap/react";

// Load all highlight.js supported languages
import { createLowlight, common } from "lowlight";
const lowlight = createLowlight(common);

import { MentionSuggestion, HexColorDecorator } from "./extensions";

import Toolbar from "./components/Toolbar";
import Popover from "./components/Popover";

import "./styles.scss";
import { useDebounceValue, useOnClickOutside } from "usehooks-ts";
import { EditorComponent } from "./types";

function Editor({
  content = "",
  editable = true,
  label = "",
  id = "",
  placeholder = "Type '/' for actions…",
  disabled = false,
  withToolbar = true,
  withPopover = false,
  withTypographyExtension = false,
  withLinkExtension = false,
  withCodeBlockLowlightExtension = false,
  withTaskListExtension = false,
  withPlaceholderExtension = false,
  withMentionSuggestion = false,
  onChange,
  onClickOutside = () => null,
  withHexColorsDecorator = false,
}: EditorComponent) {
  const [debouncedValue, setEditorHtmlContent] = useDebounceValue(
    content,
    1000,
  );
  const editorRef = useRef(null);

  useOnClickOutside(editorRef, onClickOutside);

  const extensions: Extensions = [
    StarterKit.configure({
      ...(withCodeBlockLowlightExtension && { codeBlock: false }),
    }),
  ];

  if (withTypographyExtension) {
    extensions.push(Typography);
  }

  if (withLinkExtension) {
    extensions.push(
      Link.configure({
        linkOnPaste: false,
        openOnClick: false,
      }),
    );
  }

  if (withCodeBlockLowlightExtension) {
    extensions.push(
      CodeBlockLowlight.configure({
        lowlight,
      }),
    );
  }

  if (withTaskListExtension) {
    extensions.push(TaskList, TaskItem);
  }

  if (withPlaceholderExtension) {
    extensions.push(
      Placeholder.configure({
        placeholder,
      }),
    );
  }

  if (withMentionSuggestion) {
    extensions.push(MentionSuggestion);
  }

  if (withHexColorsDecorator) {
    extensions.push(HexColorDecorator);
  }

  const editor = useEditor(
    {
      content,
      extensions,
      editable: !disabled,
      onUpdate: ({ editor }) => {
        setEditorHtmlContent(editor.getHTML());
      },
    },
    [disabled],
  );

  useEffect(() => {
    if (content !== debouncedValue) {
      onChange(debouncedValue);
    }
  }, [debouncedValue]);

  if (!editor) {
    return null;
  }

  return (
    <div ref={editorRef} style={{ width: "100%", position: "relative" }}>
      {label && <label htmlFor={id}>{label}</label>}
      {withToolbar ? <Toolbar editor={editor} /> : null}
      {withPopover ? <Popover editor={editor} /> : null}
      <EditorContent editor={editor} />
      {disabled && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            zIndex: 5,
            backgroundColor: "rgba(255,255,255, 0.5)",
          }}
        />
      )}
    </div>
  );
}

export default Editor;
