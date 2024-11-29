import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import plugin from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import child_process from 'child_process';
import { env } from 'process';

const baseFolder =
    env.APPDATA !== undefined && env.APPDATA !== ''
        ? `${env.APPDATA}/ASP.NET/https`
        : `${env.HOME}/.aspnet/https`;

const certificateName = "melloapp.client";
const certFilePath = path.join(baseFolder, `${certificateName}.pem`);
const keyFilePath = path.join(baseFolder, `${certificateName}.key`);

if (!fs.existsSync(certFilePath) || !fs.existsSync(keyFilePath)) {
    if (0 !== child_process.spawnSync('dotnet', [
        'dev-certs',
        'https',
        '--export-path',
        certFilePath,
        '--format',
        'Pem',
        '--no-password',
    ], { stdio: 'inherit', }).status) {
        throw new Error("Could not create certificate.");
    }
}

const target = env.ASPNETCORE_HTTPS_PORT ? `https://localhost:${env.ASPNETCORE_HTTPS_PORT}` :
    env.ASPNETCORE_URLS ? env.ASPNETCORE_URLS.split(';')[0] : 'https://localhost:7263';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [plugin()],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    },
    server: {
        proxy: {
            '^/weatherforecast': {
                target,
                secure: false
            },
            '^/Account/pingauth': {
                target: 'https://localhost:7263/',
                secure: false
            },
            '^/Account/pingauthadmin': {
                target: 'https://localhost:7263/',
                secure: false
            },
            '^/Account/pingauthme': {
                target: 'https://localhost:7263/',
                secure: false
            },
            '^/Account/register': {
                target: 'https://localhost:7263/',
                secure: false
            },
            '^/login': {
                target: 'https://localhost:7263/',
                secure: false
            },
            '^/Account/logout': {
                target: 'https://localhost:7263/',
                secure: false
            },
            '^/SubCompetition/GetSubCompetitionsWithArtists': {
                target: 'https://localhost:7263/',
                secure: false
            },
            '^/Prediction/batch': {
                target: 'https://localhost:7263/',
                secure: false
            },
            '^/FinalPrediction/batch': {
                target: 'https://localhost:7263/',
                secure: false
            },
            '^/Account/updateBet': {
                target: 'https://localhost:7263/',
                secure: false
            },
             '^/Users/getUserInfo': {
                target: 'https://localhost:7263/',
                secure: false
            },
            '^/Account/updateAvatar': {
                target: 'https://localhost:7263/',
                secure: false
            },
            '^/Leaderboard': {
                target: 'https://localhost:7263/',
                secure: false
            },
            '^/ScoreAfterSubCompetition/GetLeaderboardBySubCompetition': {
                target: 'https://localhost:7263/',
                secure: false
            },
            '^/SubCompetition/GetSubCompetitionsWithArtistsAndPredictions': {
                target: 'https://localhost:7263/',
                secure: false
            },
            '^/FinalPrediction': {
                target: 'https://localhost:7263/',
                secure: false
            },
            '^/ResultOfSubCompetition/Batch': {
                target: 'https://localhost:7263/',
                secure: false
            },
            '^/SubCompetition': {
                target: 'https://localhost:7263/',
                secure: false
            },
            '^/SubCompetition/GetSubCompetitionWithArtists{id}': {
                target: 'https://localhost:7263/',
                secure: false
            },
            '^/ResultOfSubCompetition': {
                target: 'https://localhost:7263/',
                secure: false
            },
            '^/SubCompetition/GetSubCompetitionsWithArtistsAndPredictionAndResults/{id}': {
                target: 'https://localhost:7263/',
                secure: false
            },
            '^/Points/{subCompetitionId}': {
                target: 'https://localhost:7263/',
                secure: false
            },
            '^/Users': {
                target: 'https://localhost:7263/',
                secure: false
            },
            '^/Points/update-points-by-details': {
                target: 'https://localhost:7263/',
                secure: false
            },
            '^/HomeContent': {
                target: 'https://localhost:7263/',
                secure: false
            },
            '^/Artists': {
                target: 'https://localhost:7263/',
                secure: false
            },
            '^/ResultOfSubCompetition/batch': {
                target: 'https://localhost:7263/',
                secure: false
            },
            '^/Points/CalculatePointsFinal': {
                target: 'https://localhost:7263/',
                secure: false
            },
            '^/SubCompetition/{id}': {
                target: 'https://localhost:7263/',
                secure: false
            },
            '^/Artists/{id}': {
                target: 'https://localhost:7263/',
                secure: false
            },
            '^/SubCompetition/GetSubCompetitionWithResult': {
                target: 'https://localhost:7263/',
                secure: false
            },
            '^/ResultOfSubCompetition{id}': {
                target: 'https://localhost:7263/',
                secure: false
            },
            '^/ScoreAfterSubCompetition/GetUserScores': {
                target: 'https://localhost:7263/',
                secure: false
            },
            '^/ScoreAfterSubCompetition': {
                target: 'https://localhost:7263/',
                secure: false
            },
            '^/ScoreAfterSubCompetition/{id}': {
                target: 'https://localhost:7263/',
                secure: false
            },
            '^/Account/': {
                target: 'https://localhost:7263/',
                secure: false
            },
            '^/Account/uploadAvatar': {
                target: 'https://localhost:7263/',
                secure: false
            },

        },
        port: 5173,
        https: {
            key: fs.readFileSync(keyFilePath),
            cert: fs.readFileSync(certFilePath),
        }
    }
})
