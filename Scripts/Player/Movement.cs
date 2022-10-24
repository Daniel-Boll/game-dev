using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Movement : MonoBehaviour {
    Rigidbody2D body;
    
    public float horizontal;
    public float vertical;

    [Header("Animations")]
    public Animator animator;

    [Space]
    [Header("Stats")]
    public float moveLimiter = 0.7f;
    public float runSpeed = 20.0f;
    public bool pulling = false;

    void Start () {
        body = GetComponentInChildren<Rigidbody2D>();
    }

    void Update() {
        // Gives a value between -1 and 1
        horizontal = Input.GetAxisRaw("Horizontal"); // -1 is left
        vertical = Input.GetAxisRaw("Vertical"); // -1 is down


        animator.SetFloat("Horizontal", horizontal);
        animator.SetFloat("Vertical", vertical);

        // Debug.Log(horizontal+" : "+vertical);

        animator.SetFloat("Speed", (new Vector2(horizontal, vertical)).sqrMagnitude);

        // Facing down
        if(vertical < 0) {
            animator.SetBool("WasFrontFacing", true);
            animator.SetBool("WasBackFacing", false);
        } else if(vertical > 0) { // Facing up
            animator.SetBool("WasBackFacing", true); 
            animator.SetBool("WasFrontFacing", false);
        }
    }

    public void PullOut() {
        GameObject.FindGameObjectWithTag("SFXManager").GetComponent<SFXManager>().playSound("Pull");
        animator.SetTrigger("Pull");
        pulling = true;
    }

    void FixedUpdate() {
        if (horizontal != 0 && vertical != 0) { // Check for diagonal movement
            // limit movement speed diagonally, so you move at 70% speed
            horizontal *= moveLimiter;
            vertical *= moveLimiter;
        } 
        if(!pulling) body.velocity = new Vector2(horizontal * runSpeed, vertical * runSpeed);
    }
}
