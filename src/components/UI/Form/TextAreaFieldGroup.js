import React from "react";

const TextAreaFieldGroup = ({
  name,
  placeholder,
  value,
  error,
  info,
  onChange,
  defaultValue,
  style
}) => {
  return (
    <div className="form-group">
      <textarea
        className="form-control form-control-lg"
        placeholder={placeholder}
        name={name}
        style={style}
        value={value}
        onChange={onChange}
        defaultValue={defaultValue}
      />
      {info && <small className="form-text text-muted">{info}</small>}
    </div>
  );
};

export default TextAreaFieldGroup;
