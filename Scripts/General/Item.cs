using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Item {
    public enum ItemType {
        Root,
    }

    public ItemType itemType;
    public int amount;

    public Sprite getSprite() {
        switch (itemType) {
            default: 
            case ItemType.Root: return ItemAssets.Instance.rootSprite;
        }
    }

    public bool isStackable() {
        switch(itemType) {
            default:
            case ItemType.Root:
                return true;
        }
    }
}
