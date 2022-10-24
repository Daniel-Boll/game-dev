using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Tilemaps;

public class Manager : MonoBehaviour {


    [Space]
    [Header("Objects needed")]
    public GameObject prefab;
    public GameObject score;
    public Tilemap tilemap;

    [Space]
    [Header("Spawning correction")]
    public float xoffset = 0;
    public float yoffset = 0;

    [Space]
    [Header("Constraints")]
    public int maxTileSize = 1;
    public int maxRootSpawn = 10;
    public float rootSpawnTimer = 3f;

    List<Vector3> tileToPlant;
    bool foundFreeTile = false;
    int position;
    GameObject player;

    // Start is called before the first frame update
    void Start() {
        player = GameObject.FindGameObjectWithTag("Player");

        tileToPlant = new List<Vector3>();
        getTilePositions();
        StartCoroutine(spawnRoot());
    }

    void getTilePositions() {
        GridLayout gridLayout = tilemap.transform.parent.GetComponentInParent<GridLayout>();
        BoundsInt bounds = tilemap.cellBounds;
        TileBase[] allTiles = tilemap.GetTilesBlock(bounds);

        for (int x = 0; x < bounds.size.x; x++) {
            for (int y = 0; y < bounds.size.y; y++) {
                TileBase tile = allTiles[x + y * bounds.size.x];
                if (tile != null) {
                    Vector3Int cellPosition = gridLayout.WorldToCell(tilemap.transform.position);
                    Vector3 resultantPosition = gridLayout.CellToWorld(new Vector3Int(x, y, 0)) + new Vector3(xoffset, yoffset, 0);
                    tileToPlant.Add(resultantPosition);
                }
            }
        }    
    }

    IEnumerator spawnRoot() {
        GameObject lastRootPlaced = null;
        if(maxRootSpawn > 0) {
            GameObject[] rootsAlreadyPlaced;
            rootsAlreadyPlaced = GameObject.FindGameObjectsWithTag("Spawnable");
            List<int> keepIds = new List<int>();

            foreach(GameObject root in rootsAlreadyPlaced) {
                RootController rc = root.GetComponent<RootController>();
                keepIds.Add(rc.id);
            }

            if(rootsAlreadyPlaced.Length < maxTileSize) {
                while(!foundFreeTile){
                    position = Random.Range(0, tileToPlant.Count);
                    if(keepIds.Contains(position)) {
                        foundFreeTile = false;
                    } else {
                        foundFreeTile = true;
                    }
                }

                GameObject newRoot = Instantiate(prefab, tileToPlant[position], Quaternion.identity);
                RootController rc = newRoot.GetComponent<RootController>();
                rc.id = position;
                maxRootSpawn--;
                rc.last = maxRootSpawn == 0 ? true : false;                
            }
            yield return new WaitForSeconds(rootSpawnTimer);
            foundFreeTile = false;
            StartCoroutine(spawnRoot());
        }
    }

    public void lastCollection() {
        score.SetActive(true);
        score.GetComponent<Score>().showScore(player.GetComponent<Controller>().score);
        player.GetComponent<Controller>().roundOver = true;   
    }
}
