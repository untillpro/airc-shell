/*
 * Copyright (c) 2020-present unTill Pro, Ltd.
 */

class OrderedObject {
    constructor() {
        this.index = [];
    }

    add(key, value) {
       if (!this[key]) {
          this.index.push(key);
       }
       this[key] = value;
    }

    remove(key) {
       if (!this[key]) { return; }
       this.index.splice(this.index.indexOf(key), 1);
       delete this[key];
    }

    inserAfterKey(afterKey, key, value) {
      const index = this.indexOf(afterKey);

      if (index > 0) {
         this.inserAfter(index, key, value);
      } else {
         this.add(key, value);
      }
    }

    inserBeforeKey(beforeKey, key, value) {
      const index = this.indexOf(beforeKey);

      if (index > 0) {
         this.insertBefore(index, key, value);
      } else {
         this.add(key, value);
      }
    }

    inserAfter(i, key, value) {
      this[key] = value;
      this.index.splice(i + 1, 0, key);
    }

    inserBefore(i, key, value) {
      this[key] = value;
      this.index.splice(i, 0, key);
    }

    indexOf(key) {
      return this.index.indexOf(key);
    }
    
    keyAt(i) {
      return this.index[i];
    }

   length() {
      return this.index.length;
   }

   valueAt(i) {
      return this[this.keyAt(i)];
   }

   previousKey(key) {
      return this.keyAt(this.indexOf(key) - 1);
   }

   nextKey(key) {
      return this.keyAt(this.indexOf(key) + 1);
   }

   iterate(itterator) {
        this.index.forEach((index) => {
            if (this[index]) itterator(this[index], index);
        });
   }

   asArray() {
        const result = [];

        this.index.forEach((index) => {
            if (this[index]) result.push(this[index]);
        });

      return result;
   }

   getKeys() {
      return this.index;
   }

   size() {
      return this.index.length;
   }

   copy() {
      const copy = new OrderedObject();
      this.iterate((value, key) => {
         copy.add(key, value);
      });

      return copy;
   }
}

export default OrderedObject;