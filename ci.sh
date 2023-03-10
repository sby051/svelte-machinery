# read the version from the package.json file
# then read the latest entry from the changelog
# if the version is not in the changelog, then fail

# read the version from the package.json file
version=$(cat package.json | grep version | head -1 | awk -F: '{ print $2 }' | sed 's/[",]//g' | tr -d '[[:space:]]')

# read the latest entry from the changelog
# this is the first line after the first instance of "##"
latest=$(cat CHANGELOG.md | grep -A 1 "^## " | head -1 | sed 's/## //g' | tr -d '[[:space:]]')

echo "Version in package.json: $version"

# if the version is not in the changelog, then fail
if [ "$version" != "$latest" ]; then
  echo "[CI-ALERT] :: [$(date +%x)] -> Version in package.json ($version) does not match latest entry in CHANGELOG.md ($latest)
[!] CI cannot continue without a matching version in the changelog.
[!] Please update the changelog and try again.
[!] Exiting with error code 1.
  "
  exit 1
fi

# if we get here, then the version is in the changelog

# we want to see if the current repo is equal to the repo in the package.json file
# if it is, then we can continue
# if it is not, then we cannot continue
# this is to prevent a malicious user from changing the package.json file to point to their own repo
# and then running the CI script to publish to their own repo

# get the repo name from the package.json file
repo=$(cat package.json | grep name | head -1 | awk -F: '{ print $2 }' | sed 's/[",]//g' | tr -d '[[:space:]]')

# get the repo name from the current repo
current_repo=$(git remote -v | grep fetch | head -1 | awk '{ print $2 }' | sed 's/.*\///g' | sed 's/.git//g')

# if the repo names do not match, then fail
if [ "$repo" != "$current_repo" ]; then
  echo "[CI-ALERT] :: [$(date +%x)] -> Repo name in package.json ($repo) does not match current repo ($current_repo)
[!] CI cannot continue without a matching repo name in the package.json file.
[!] Please update the package.json file and try again.
[!] Exiting with error code 1.
  "
  exit 1
fi

# if we get here, then the repo names match

# we can continue

echo "Version in package.json ($version) matches latest entry in CHANGELOG.md ($latest)

[+] CI can continue.
[+] Running $(cat package.json | grep name | head -1 | awk -F: '{ print $2 }' | sed 's/[",]//g' | tr -d '[[:space:]]')
"
exit 0