import React, { useState } from 'react';
import './IntialSetting.css';
import { FaTimes } from 'react-icons/fa';

function IntialSetting(props) {
    const [selectedProvider, setSelectedProvider] = useState("OpenAI");

    const modelOptions = {
        OpenAI: {
            "GPT-4 Turbo": "gpt-4-turbo",
            "GPT-4o": "gpt-4o",
            "GPT-4o Latest": "gpt-4o-2024-11-20",
            "GPT-4o Mini": "gpt-4o-mini",
            "ChatGPT": "chatgpt-4o-latest"
        },
        Anthropic: {
            "Claude 3.5 Sonnet": "claude-3-5-sonnet-20241022",
            "Claude 3.5 Haiku": "claude-3-5-haiku-20241022",
            "Claude 3 Opus": "claude-3-opus-20240229",
            "Claude 3 Sonnet": "claude-3-sonnet-20240229",
            "Claude 3 Haiku": "claude-3-haiku-20240307"
        },
        Google: {
            "Gemini 1.5 Pro": "gemini-1.5-pro",
            "Gemini 1.5 Flash": "gemini-1.5-flash",
            "Gemini 2.0 Flash Experimental": "gemini-2.0-flash-exp",
            "Gemini Experimental 1206": "gemini-exp-1206"
        },
        XAI: {
            "Grok-2": "grok-2-latest",
            "Grok Beta": "grok-beta"
        }
    };
    

    return props.trigger ? (
        <div className="showSetting" onClick={() => props.setTrigger(false)}>
            <div className="showSetting-inner" onClick={(e) => e.stopPropagation()}>
                <label className="setting-size">Settings</label>
                <button className="close-btn" onClick={() => props.setTrigger(false)}>
                    <FaTimes />
                </button>

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
                        {Object.entries(modelOptions[selectedProvider]).map(([displayName, backendName]) => (
                            <option key={backendName} value={backendName}>
                                {displayName}
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
