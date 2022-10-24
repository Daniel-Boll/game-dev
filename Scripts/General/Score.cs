using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using TMPro;

public class Score : MonoBehaviour {
    
    public int maxScore = 12;
    private Transform LevelScore;  

    private void Awake() {
        LevelScore = transform.Find("LevelScoreText");
    }

    public void showScore(int score) {
        TextMeshProUGUI uiText = LevelScore.GetComponent<TextMeshProUGUI>();
        uiText.SetText("Collected Roots: "+score+" / "+maxScore);
    }
}
