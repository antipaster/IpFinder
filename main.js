/*
 * Copyright 2024
 * Author: Intexpression (github.com/intexpression)
 * Discord: cbzc 
 * Telegram: t.me/intexpression
 */

const fs = require('fs');
const axios = require('axios');
const { Client, Intents } = require('discord.js');
const config = require('./config.json');
const { token, ipinfoToken } = config;


const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
const prefix = '!';
client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  if (message.content.startsWith(prefix)) {
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();
 if (command === 'find' && args.length === 1) {
      const targetWord = args[0].toLowerCase();
      const fileData = fs.readFileSync('database.txt', 'utf-8');
      const lines = fileData.split('\n');

      let correspondingText = null;

      for (const line of lines) {
        const [word, text] = line.split(':').map(item => item.trim().toLowerCase());
        
        if (word === targetWord) {
          correspondingText = text;
          break;
        }
      }

      if (correspondingText !== null) {
        message.reply(`Player: ${targetWord}, IP: ${correspondingText}`);
        if (/^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/.test(correspondingText)) {
          try {
            const ipInfoResponse = await axios.get(`https://ipinfo.io/${correspondingText}/json?token=${ipinfoToken}`);
            const ipInfoData = ipInfoResponse.data;
            message.reply(`Info about IP ${correspondingText}:\n${JSON.stringify(ipInfoData, null, 2)}`);
          } catch (error) {
            console.error('Error: ', error.message);
          }
        }
      } else {
        message.reply(`Invalid Player ${targetWord}`);
      }
    }
  }
});

client.login(token);
