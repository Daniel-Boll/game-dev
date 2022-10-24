using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Controller : MonoBehaviour {

    [Header("Objects")]
    public Inventory inventory;
    public LevelLoader levelLoader;

    [Space]
    [Header("Variables")]
    public int score;
    public bool roundOver = false;

    [SerializeField] private UI_Inventory uiInventory;

    // Start is called before the first frame update
    void Start() {
        inventory = new Inventory();
        uiInventory.setInventory(inventory);
    }

    void Update() {
        if(roundOver) {
            if(Input.GetKeyDown(KeyCode.Space)) {
                LevelLoader go = Instantiate(levelLoader);
                go.GetComponent<LevelLoader>().loadNextLevel();
            }
        }
    }
}
