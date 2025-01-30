import React, { useState } from 'react';
import './IntialSetting.css';

function IntialSetting(props) {
    const [selectedProvider, setSelectedProvider] = useState("OpenAI");

    const modelOptions = {
        OpenAI: ["GPT-4.0", "GPT-4o"],
        Google: ["Gemini 2.0", "Gemini 3.0"],
        Anthropic: ["Claude 2", "Claude 3"],
        XAI: ["X-Model 1", "X-Model 2"]
    };

    return props.trigger ? (
        <div className="showSetting" onClick={() => props.setTrigger(false)}>
            <div className="showSetting-inner" onClick={(e) => e.stopPropagation()}>
                <label className="setting-size">Settings</label>
                <button className="close-btn" onClick={() => props.setTrigger(false)}>Close</button>

                <br />
                <br />

                {/* Model Provider Selection */}
                <div className="form-group">
                    <label htmlFor="model-provider">Model Provider</label>
                    <select
                        id="model-provider"
                        value={selectedProvider}
                        onChange={(e) => setSelectedProvider(e.target.value)}
                    >
                        {Object.keys(modelOptions).map((provider) => (
                            <option key={provider} value={provider}>
                                {provider}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Model Name Selection */}
                <div className="form-group">
                    <label htmlFor="model-name">Model Name</label>
                    <select id="model-name">
                        {modelOptions[selectedProvider].map((model) => (
                            <option key={model} value={model}>
                                {model}
                            </option>
                        ))}
                    </select>
                </div>

                {/* API Key Inputs */}
                <div className="form-group">
                    <label htmlFor="model-api">Model API Key</label>
                    <textarea id="model-api" placeholder="Enter API Key, one per line"></textarea>
                </div>

                <div className="form-group">
                    <label htmlFor="brave-api">Brave Search API Key</label>
                    <input type="text" id="brave-api" placeholder="Enter API Key" />
                </div>

                {/* Proxy List */}
                <div className="form-group">
                    <label htmlFor="proxy-list">Proxy List</label>
                    <textarea id="proxy-list" placeholder="Enter proxies, one per line"></textarea>
                </div>

                {/* Neo4j Configuration */}
                <div className="form-group">
                    <label htmlFor="neo4j-url">Neo4j URL</label>
                    <input type="text" id="neo4j-url" placeholder="Enter Neo4j URL" />
                </div>

                <div className="form-group">
                    <label htmlFor="neo4j-username">Neo4j Username</label>
                    <input type="text" id="neo4j-username" placeholder="Enter Username" />
                </div>

                <div className="form-group">
                    <label htmlFor="neo4j-password">Neo4j Password</label>
                    <input type="password" id="neo4j-password" placeholder="Enter Password" />
                </div>

                {props.children}
            </div>
        </div>
    ) : null;
}

export default IntialSetting;
