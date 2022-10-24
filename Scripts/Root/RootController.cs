using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class RootController : MonoBehaviour {

    [Header("Root's status")]
    public int startLife = 100;
    public int currentLife;
    public int id = -1;
    public int countdown = 10;
    public float rootRate;
    public bool last;

    [Space]
    [Header("Elements of the root")]
    public GameObject Visual;

    GameObject player;

    // Start is called before the first frame update
    void Start() {
        // A ---- B                       10        ------     4
        // C ---- X                       countdown ------     rootRate
        // X = (A * B) / C
        currentLife = startLife;
        rootRate = (10*4) / countdown;
        StartCoroutine(startCountdown());
        player = GameObject.FindGameObjectWithTag("Player");
    }

    // Update is called once per frame
    void Update() {
        if(currentLife <= 0) {
            Destroy(this.gameObject);
            player.GetComponent<Controller>().inventory.addItem(new Item { itemType = Item.ItemType.Root, amount = 1});
            player.GetComponent<Controller>().score++;
            if(last) GameObject.FindGameObjectWithTag("FarmManager").GetComponent<Manager>().lastCollection();
        } else if(countdown == 0) {
            Destroy(this.gameObject);
            if(last) GameObject.FindGameObjectWithTag("FarmManager").GetComponent<Manager>().lastCollection();
        }
    }

    private static float map(float value, float fromLow, float fromHigh, float toLow, float toHigh) {
        return (value - fromLow) * (toHigh - toLow) / (fromHigh - fromLow) + toLow;
    }

    public void destroyRoot() {
        // I could add a mechanic where you can pull the root faster
        // if you have a proper tool to do so 
        currentLife -= 100;
    }

    IEnumerator startCountdown() {
        // Root process, get's darker with the countdown rate
        Color currentColor = Visual.GetComponent<SpriteRenderer>().color;
        float offset = map(4 * (11 - countdown), 0f, 255f, 0f, 1f);
        Color newColor = new Color(currentColor.r - offset, currentColor.g - offset, currentColor.b - offset, currentColor.a);
        Visual.GetComponent<SpriteRenderer>().color = newColor;
        countdown--;
        yield return new WaitForSeconds(1f);
        StartCoroutine(startCountdown());
    }
}
