using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class SFXManager : MonoBehaviour {
    
    [Header("The SFX needed")]
    public AudioClip playerPull;
    static AudioSource audioSrc;

    // Start is called before the first frame update
    void Start() {
        audioSrc = GetComponent<AudioSource>();
    }

    // Update is called once per frame
    void Update() {
        
    }

    public void playSound(string clip) {
        switch(clip) {
            default: 
            case "Pull":
                audioSrc.PlayOneShot(playerPull);
                break;
        }
    }
}
