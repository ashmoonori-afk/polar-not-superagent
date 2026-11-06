# Set up Polar from the Claude or ChatGPT app

This page is for you, the app agent: the Claude or ChatGPT desktop app session that {user} is talking to. {user} is the person in this chat.

You do not become Polar. You are a bridge. You install Polar, start it in a hidden terminal on {user}'s computer, and pass messages between Polar and {user} until Polar's own messenger bot greets {user}. Then you stop, and {user} talks to Polar in the messenger.

Do every step in order. Do not stop at a summary that announces the next step: take it.

## What you need

- You must be able to run shell commands on {user}'s computer. In the Claude desktop app that is a session in the Code tab; in the ChatGPT desktop app it is a chat that can use the terminal.
- macOS first; Linux and WSL also work. Windows outside WSL does not.
- If you cannot run commands, tell {user} to open Terminal, paste this line once, and then answer Polar's questions there with `tmux attach -t polar`:

  ```bash
  curl -fsSL https://raw.githubusercontent.com/ashmoonori-afk/polar-not-superagent/main/polar/bootstrap.sh | bash
  ```

## 1. Run the bootstrap

1. Download the script and preview it. The preview changes nothing:

   ```bash
   curl -fsSL https://raw.githubusercontent.com/ashmoonori-afk/polar-not-superagent/main/polar/bootstrap.sh -o /tmp/polar-bootstrap.sh
   bash /tmp/polar-bootstrap.sh --dry-run
   ```

2. Tell {user} in two or three plain sentences what it will do: install Node.js, omo and tmux where they are missing (without sudo), start Polar in a hidden terminal, and make it start again at every login. If {user} does not want the autostart, add `--no-autostart` in the next step.
3. Run it:

   ```bash
   bash /tmp/polar-bootstrap.sh
   ```

4. If it stops with a sentence about what to install (for example tmux), pass that sentence to {user}, wait until they say it is done, and run step 3 again. Running it again is safe.

The bootstrap installs two helpers that you use from here on:

- `~/.polar/bin/screen.sh 40` prints the last 40 non-blank lines of Polar's screen.
- `~/.polar/bin/send.sh "text"` types the text into Polar and presses Enter. `~/.polar/bin/send.sh --key Down` presses one key: `Enter`, `Escape`, `Down` or `Up`. Use keys for menus.

## 2. Model login (only when the bootstrap asks for it)

Skip this step if the bootstrap printed `model login found`. If it printed `no model login yet`:

1. Run `~/.polar/bin/send.sh /login`, then `~/.polar/bin/screen.sh 40` to see the provider menu.
2. Ask {user} which subscription or key they want Polar to use, for example Claude Pro/Max, ChatGPT Plus/Pro or GitHub Copilot. Move through the menu with `--key Down` and `--key Up`, and choose with `--key Enter`.
3. When the screen shows a sign-in link, send that link to {user} and ask them to open it and finish the sign-in in their browser. If the screen then asks for a code that the browser showed them, ask {user} for the code and type it with `send.sh`.
4. When the screen says the login worked, start the setup:

   ```bash
   ~/.polar/bin/send.sh "$(cat ~/.polar/setup-prompt.txt)"
   ```

## 3. Bridge loop

Repeat until the stop condition below:

1. Read the screen: `~/.polar/bin/screen.sh 40`.
2. If Polar is still working, wait about 30 seconds and read again.
3. If Polar asks {user} something (a question, a choice, a link to open, a code), ask {user} in this chat. Say it comes from Polar, keep Polar's meaning, and use {user}'s language. Then wait for {user}'s answer.
4. Send the answer as one line with `send.sh`, or press the menu keys {user} chose. Then go back to 1.

Rules for the loop:

- Never answer for {user}. Every question and choice goes to {user}, including permission prompts in Polar's terminal.
- Send only what {user} said. Do not add instructions of your own to Polar.
- Keep {user}'s answers, codes and links out of anything you save or share.

Stop condition: Polar says its messenger bot greeted {user}, and {user} confirms they see the greeting. Then tell {user} that from now on they talk to Polar in the messenger, that this app chat is no longer needed, and stop reading the screen.

## Let {user} look at the hidden terminal

If {user} wants to watch Polar directly, they open Terminal and run:

```bash
tmux attach -t polar
```

They leave with Ctrl-b, then d. Polar keeps running. Typing `exit` or pressing Ctrl-c inside that window stops Polar. If the bootstrap used GNU screen instead of tmux, the commands are `screen -r polar` and Ctrl-a, then d.

## Stop or uninstall

- Stop bridging: end the loop. Polar keeps running.
- Stop Polar until the next login: `tmux kill-session -t polar` (or `screen -S polar -X quit`).
- Uninstall: this stops the hidden session and removes the autostart. It keeps `~/.polar`, which holds {user}'s profile, memory and settings. Delete that folder only if {user} asks to remove everything.

  ```bash
  curl -fsSL https://raw.githubusercontent.com/ashmoonori-afk/polar-not-superagent/main/polar/bootstrap.sh | bash -s -- --uninstall
  ```

## If something goes wrong

- `screen.sh` says no hidden session is running: run the bootstrap again.
- On WSL without systemd the bootstrap installs no autostart and says so. Polar then needs the bootstrap again after each restart, unless {user} turns systemd on in `/etc/wsl.conf` (`[boot]` then `systemd=true`).
- Polar's working folder is `~/.polar/home`. On macOS the autostart is `~/Library/LaunchAgents/local.polar-not-superagent.polar.plist`; on Linux it is the systemd user unit `polar.service`.
