
echo "Starting watchers..."
parallel -u ::: "chokidar templates -c 'npm run lodash'" "brunch watch --server"
