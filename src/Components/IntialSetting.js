import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Slider from '@mui/material/Slider';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import './IntialSetting.css';
import { FaTimes, FaEye, FaEyeSlash } from 'react-icons/fa';

function IntialSetting(props) {
  // Controlled states for Model Provider and sliders
  const [selectedProvider, setSelectedProvider] = useState("OpenAI");
  const [modelTemperature, setModelTemperature] = useState(0.0);
  const [modelTopP, setModelTopP] = useState(1.0);
  const [showPassword, setShowPassword] = useState(false);

  // Snackbar state for notifications
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success", // "success" or "error"
  });

  // Ref for the form element
  const formRef = useRef(null);

  // React Router hook to navigate programmatically
  const navigate = useNavigate();

  // Define model options
  const modelOptions = {
    OpenAI: {
      "GPT-4 Turbo": "gpt-4-turbo",
      "GPT-4o": "gpt-4o",
      "GPT-4o Latest": "gpt-4o-2024-11-20",
      "GPT-4o Mini": "gpt-4o-mini",
      "ChatGPT": "chatgpt-4o-latest",
    },
    Anthropic: {
      "Claude 3.5 Sonnet": "claude-3-5-sonnet-20241022",
      "Claude 3.5 Haiku": "claude-3-5-haiku-20241022",
      "Claude 3 Opus": "claude-3-opus-20240229",
      "Claude 3 Sonnet": "claude-3-sonnet-20240229",
      "Claude 3 Haiku": "claude-3-haiku-20240307",
    },
    Google: {
      "Gemini 1.5 Pro": "gemini-1.5-pro",
      "Gemini 1.5 Flash": "gemini-1.5-flash",
      "Gemini 2.0 Flash Experimental": "gemini-2.0-flash-exp",
      "Gemini Experimental 1206": "gemini-exp-1206",
    },
    XAI: {
      "Grok-2": "grok-2-latest",
      "Grok Beta": "grok-beta",
    },
  };

  // Reset handler: resets both the form (uncontrolled fields) and controlled states
  const handleReset = (e) => {
    e.preventDefault();
    if (formRef.current) {
      formRef.current.reset();
    }
    setSelectedProvider("OpenAI");
    setModelTemperature(0.0);
    setModelTopP(1.0);
  };

  // Snackbar close handler (ignores "clickaway" so that error notifications require explicit close)
  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  // Save handler: validates the form, shows notifications, calls the parent's callback
  // to update the underlying page (spinner/initializing text), sends the API request, and
  // navigates to /AiPage when the backend returns success.
  const handleSave = async (e) => {
    e.preventDefault();
    const form = formRef.current;

    // Retrieve values from form fields using their name attribute
    const modelProvider = form.elements["model-provider"].value;
    const modelName = form.elements["model-name"].value;
    const modelAPIKeys = form.elements["model-api"].value;
    const braveAPIKey = form.elements["brave-api"].value;
    const proxyList = form.elements["proxy-list"].value;
    const neo4jURL = form.elements["neo4j-url"].value;
    const neo4jUsername = form.elements["neo4j-username"].value;
    const neo4jPassword = form.elements["neo4j-password"].value;

    // Validate required fields and collect missing field names
    const missingFields = [];
    if (!modelProvider || modelProvider.trim() === "") missingFields.push("Model Provider");
    if (!modelName || modelName.trim() === "") missingFields.push("Model Name");
    if (!modelAPIKeys || modelAPIKeys.trim() === "") missingFields.push("Model API Key");
    if (!braveAPIKey || braveAPIKey.trim() === "") missingFields.push("Brave Search API Key");
    if (!neo4jURL || neo4jURL.trim() === "") missingFields.push("Neo4j URL");
    if (!neo4jUsername || neo4jUsername.trim() === "") missingFields.push("Neo4j Username");
    if (!neo4jPassword || neo4jPassword.trim() === "") missingFields.push("Neo4j Password");

    // If any required fields are missing, show an error notification
    if (missingFields.length > 0) {
      setSnackbar({
        open: true,
        message: "Please fill in the following required fields: " + missingFields.join(", "),
        severity: "error",
      });
      return;
    }

    // Show the success notification (auto-hides after 3 seconds)
    setSnackbar({
      open: true,
      message: "Settings saved successfully!",
      severity: "success",
    });

    // Call the parent's callback to change the underlying page's content (spinner/text)
    if (props.onInitializationStart) {
      props.onInitializationStart();
    }

    // Build the JSON payload
    const payload = {
      "Model_Provider": modelProvider.toLowerCase(),
      "Model_Name": modelName,
      "Model_API_Keys": modelAPIKeys,
      "Brave_Search_API_Key": braveAPIKey,
      "Neo4j_URL": neo4jURL,
      "Neo4j_Username": neo4jUsername,
      "Neo4j_Password": neo4jPassword,
      "Model_Temperature": modelTemperature,
      "Model_Top_P": modelTopP,
    };

    // Include Proxy List if provided
    if (proxyList && proxyList.trim() !== "") {
      payload["Proxy_List"] = proxyList;
    }

    // Send the payload to the backend
    try {
      const response = await fetch("http://127.0.0.1:8000/settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      if (response.ok) {
        const data = await response.json();
        // When the backend returns {"success": true}, navigate to /AiPage
        if (data.success === true) {
          navigate("/AiPage");
        }
      } else {
        // If response is not OK, display error notification
        setSnackbar({
          open: true,
          message: "Error saving settings. Please try again.",
          severity: "error",
        });
      }
    } catch (error) {
      console.error("Error saving settings:", error);
      // Show error notification
      setSnackbar({
        open: true,
        message: "Error saving settings. Please try again.",
        severity: "error",
      });
    }
  };

  return props.trigger ? (
    <div className="showSetting" onClick={() => props.setTrigger(false)}>
      <div className="showSetting-inner" onClick={(e) => e.stopPropagation()}>
        <label className="setting-size">Settings</label>
        <button className="close-btn" onClick={() => props.setTrigger(false)}>
          <FaTimes />
        </button>
        <br /><br />
        <form ref={formRef}>

          {/* Model Provider Selection */}
          <div className="form-group">
            <label htmlFor="model-provider">Model Provider</label>
            <select
              id="model-provider"
              name="model-provider"
              value={selectedProvider}
              onChange={(e) => setSelectedProvider(e.target.value)}
            >
              {Object.keys(modelOptions).map(provider => (
                <option key={provider} value={provider}>
                  {provider}
                </option>
              ))}
            </select>
          </div>

          {/* Model Name Selection */}
          <div className="form-group">
            <label htmlFor="model-name">Model Name</label>
            <select id="model-name" name="model-name">
              {Object.entries(modelOptions[selectedProvider]).map(
                ([displayName, backendName]) => (
                  <option key={backendName} value={backendName}>
                    {displayName}
                  </option>
                )
              )}
            </select>
          </div>

          {/* API Key Inputs */}
          <div className="form-group">
            <label htmlFor="model-api">Model API Key</label>
            <textarea
              id="model-api"
              name="model-api"
              placeholder="Enter API Key, one per line"
            ></textarea>
          </div>
          <div className="form-group">
            <label htmlFor="brave-api">Brave Search API Key</label>
            <input
              type="text"
              id="brave-api"
              name="brave-api"
              placeholder="Enter API Key"
            />
          </div>

          {/* Proxy List */}
          <div className="form-group">
            <label htmlFor="proxy-list">Proxy List</label>
            <textarea
              id="proxy-list"
              name="proxy-list"
              placeholder="Enter proxies, one per line"
            ></textarea>
          </div>

          {/* Neo4j Configuration */}
          <div className="form-group">
            <label htmlFor="neo4j-url">Neo4j URL</label>
            <input
              type="text"
              id="neo4j-url"
              name="neo4j-url"
              placeholder="Enter Neo4j URL"
            />
          </div>
          <div className="form-group">
            <label htmlFor="neo4j-username">Neo4j Username</label>
            <input
              type="text"
              id="neo4j-username"
              name="neo4j-username"
              placeholder="Enter Username"
            />
          </div>
          <div className="form-group">
            <label htmlFor="neo4j-password">Neo4j Password</label>
            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                id="neo4j-password"
                name="neo4j-password"
                placeholder="Enter Password"
              />
              <IconButton 
                onClick={() => setShowPassword(prev => !prev)}
                className="password-toggle"
                sx={{ 
                  color: "white",  // Change the color of the icon
                  p: 0,           // Remove internal padding
                  m: 0            // Remove any margin
                }}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </IconButton>
            </div>
          </div>

          {/* Model Temperature and Top-P */}
          <div className="form-group">
            <div className="sliders-container">
              <div className="slider-item">
                <label htmlFor="temperature">Temperature</label>
                <Slider
                  id="temperature"
                  value={modelTemperature}
                  onChange={(e, newValue) => setModelTemperature(newValue)}
                  step={0.05}
                  min={0.0}
                  max={1.0}
                  valueLabelDisplay="auto"
                  sx={{ width: '100%', color: 'success.main' }}
                />
              </div>
              <div className="slider-item">
                <label htmlFor="top-p">Top-P</label>
                <Slider
                  id="top-p"
                  value={modelTopP}
                  onChange={(e, newValue) => setModelTopP(newValue)}
                  step={0.05}
                  min={0.0}
                  max={1.0}
                  valueLabelDisplay="auto"
                  sx={{ width: '100%', color: 'success.main' }}
                />
              </div>
            </div>
          </div>

          {/* Buttons */}
          <Stack direction="row" spacing={2} sx={{ justifyContent: 'flex-end' }}>
            <Button type="button" className="reset-btn" sx={{ color: "#2196f3" }} onClick={handleReset}>
              Reset
            </Button>
            <Button type="button" variant="contained" color="success" className="save-btn" onClick={handleSave}>
              Save
            </Button>
          </Stack>
        </form>
        
        {/* Notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={snackbar.severity === 'success' ? 3000 : null}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
        {props.children}
      </div>
    </div>
  ) : null;
}

export default IntialSetting;
