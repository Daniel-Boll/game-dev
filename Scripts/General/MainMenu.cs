using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class MainMenu : MonoBehaviour {

    [Header("Level loader")]
    public LevelLoader levelLoader;

    public void playGame() {
        levelLoader.GetComponent<LevelLoader>().loadNextLevel();
    }

    public void quitGame() => Application.Quit();

}
