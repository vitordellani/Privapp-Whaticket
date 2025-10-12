"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));

let cachedTitle = null;

const stripQuotes = (v) => {
    if (!v) return v;
    const s = String(v).trim();
    if ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'"))) {
        return s.slice(1, -1);
    }
    return s;
};

const loadFromFrontendEnv = () => {
    try {
        const candidates = [
            path_1.default.resolve(__dirname, '..', '..', '..', 'frontend', '.env'),
            path_1.default.resolve(__dirname, '..', '..', '..', '..', 'frontend', '.env')
        ];
        for (const candidate of candidates) {
            if (!fs_1.default.existsSync(candidate)) continue;
            const content = fs_1.default.readFileSync(candidate, 'utf8');
            const lines = content.split(/\r?\n/);
            for (const raw of lines) {
                const line = String(raw).trim();
                if (!line || line.startsWith('#') || !line.includes('=')) continue;
                const idx = line.indexOf('=');
                const k = line.slice(0, idx).replace(/\s+/g, '').toUpperCase();
                const v = line.slice(idx + 1);
                const isTitleKey = (
                    k === 'REACT_APP_TITLE' ||
                    k === 'REACT_APP_TITILE' ||
                    k === 'REACT_APP_ITITLE' ||
                    (k.startsWith('REACT_APP') && k.includes('TITLE'))
                );
                if (isTitleKey) {
                    return stripQuotes(v);
                }
            }
        }
        return null;
    } catch (e) {
        return null;
    }
};

const GetAppTitle = () => {
    if (cachedTitle) return cachedTitle;
    const fromEnv = process.env.REACT_APP_TITLE || process.env.APP_TITLE;
    if (fromEnv && String(fromEnv).trim()) {
        cachedTitle = stripQuotes(fromEnv);
        return cachedTitle;
    }
    const fromFile = loadFromFrontendEnv();
    if (fromFile && String(fromFile).trim()) {
        cachedTitle = stripQuotes(fromFile);
        return cachedTitle;
    }
    cachedTitle = 'Whaticket';
    return cachedTitle;
};

exports.default = GetAppTitle;
