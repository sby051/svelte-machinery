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
echo "Version in package.json ($version) matches latest entry in CHANGELOG.md ($latest)

[+] CI can continue.
[+] Running $(cat package.json | grep name | head -1 | awk -F: '{ print $2 }' | sed 's/[",]//g' | tr -d '[[:space:]]')
"
exit 0