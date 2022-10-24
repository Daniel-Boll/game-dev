using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Events;

public class Interaction : MonoBehaviour {

    [Header("Stats")]
    public bool isInRange;
    public KeyCode interactKey;
    public UnityEvent interactAction;

    GameObject player;
    GameObject root;
    
    void Start() {
        player = GameObject.FindGameObjectWithTag("Player");
        root = GameObject.FindGameObjectWithTag("Spawnable");
    }

    
    void Update() {
        if(isInRange) { 
            if(Input.GetKeyDown(interactKey)) { // check if the key has been pressed
                if(!player.GetComponent<Movement>().pulling && (player.GetComponent<Movement>().horizontal == 0 && player.GetComponent<Movement>().vertical == 0)) {
                    player.GetComponent<Movement>().PullOut();
                    StartCoroutine(awaitPull());                    
                }
            }
        }
    }

    IEnumerator awaitPull() {
        yield return new WaitForSeconds(.50f);
        player.GetComponent<Movement>().pulling = false;
        interactAction.Invoke(); // Fire the event
    }

    private void OnTriggerEnter2D(Collider2D other) {
        if(other.gameObject.CompareTag("Player")) {
            isInRange = true;
        } 
    }

    private void OnTriggerExit2D(Collider2D other) {
        if(other.gameObject.CompareTag("Player")) {
            isInRange = false;
        }
    }
}
