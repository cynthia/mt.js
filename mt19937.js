/************************************************************************************************
 * JavaScript Version:  Copyright (c) 2012 Sangwhan Moon (https://github.com/cynthia/mt.js)     *
 * NOTE: Not recommended for scientific purposes due to how the range limiting works.           *
 *                                                                                              *
 * Based on C# Version: Copyright (C) 2001-2004 Akihilo Kramot (Takel).                         *
 * C# porting from a C-program for MT19937, originaly coded by:                                 *
 * Takuji Nishimura, considering the suggestions by Topher Cooper and Marc Rieffel, 1997.       *
 * This library is free software under the Artistic license.                                    *
 *                                                                                              *
 * You can find the original C-program at  - http://www.math.keio.ac.jp/~matumoto/mt.html       *
 ************************************************************************************************/

var MersenneTwister = function() {

    // Period parameters

    this.N = 624;
    this.M = 397;

    this.MATRIX_A   = 0x9908b0df; // Constant vector
    this.UPPER_MASK = 0x80000000; // Most significant w-r bits
    this.LOWER_MASK = 0x7fffffff; // Least significant r bits

    // Tempering parameters

    this.TEMPERING_MASK_B = 0x9d2c5680;
    this.TEMPERING_MASK_C = 0xefc60000;

    this.TEMPERING_SHIFT_U = function(y) { return (y >> 11); }
    this.TEMPERING_SHIFT_S = function(y) { return (y <<  7); }
    this.TEMPERING_SHIFT_T = function(y) { return (y << 15); }
    this.TEMPERING_SHIFT_L = function(y) { return (y >> 18); }

    this.RAND_MAX = 2147483648;

    this.mt = [];
    this.mti = 0;
    this.mag01 = [0x0, this.MATRIX_A];

    this.init = function(seed) {

        if (!seed)
        {
            // 4357 is what is used in the reference implementation, but for the sake of
            // simplicity we'll seed based on millisecond timestamps.

            // seed = 4357;

            seed = new Date().getTime();

        }

        this.mt[0] = seed & 0xffffffff;

        for (this.mti = 1; this.mti < this.N; this.mti++)
            this.mt[this.mti] = (69069 * this.mt[this.mti - 1]) & 0xffffffff

    };

    this.generateUInt = function() {

        var y;

        // mag01[x] = x * MATRIX_A  for x=0,1
        if (this.mti >= this.N) // generate N words at one time
        {
            var kk = 0;

            for (; kk < this.N - this.M; ++kk)
            {
                y = (this.mt[kk] & this.UPPER_MASK) | (this.mt[kk + 1] & this.LOWER_MASK);
                this.mt[kk] = this.mt[kk + this.M] ^ (y >> 1) ^ this.mag01[y & 0x1];
            }

            for(;kk < this.N - 1; ++kk)
            {
                y = (this.mt[kk] & this.UPPER_MASK) | (this.mt[kk + 1] & this.LOWER_MASK);
                this.mt[kk] = this.mt[kk+(this.M - this.N)] ^ (y >> 1) ^ this.mag01[y & 0x1];
            }

            y = (this.mt[this.N - 1] & this.UPPER_MASK) | (this.mt[0] & this.LOWER_MASK);
            this.mt[this.N - 1] = this.mt[this.M - 1] ^ (y >> 1) ^ this.mag01[y & 0x1];

            this.mti = 0;
        }

        y = this.mt[this.mti++];
        y ^= this.TEMPERING_SHIFT_U(y);
        y ^= this.TEMPERING_SHIFT_S(y) & this.TEMPERING_MASK_B;
        y ^= this.TEMPERING_SHIFT_T(y) & this.TEMPERING_MASK_C;
        y ^= this.TEMPERING_SHIFT_L(y);

        return y;

    };

    this.nextInt = function(p1, p2) {

        // To provide the exact functionality the original implementation provides,
        // we use generic terms of p1 (first parameter) and p2 (second parameter)
        // as a workaround for JavaScript's limitations. Unlike the original code,
        // min and max is position independent.

        if (!p1 && !p2)
            return this.generateUInt();

        else if (!p2) // If parameter 2 is unspecified, assume p1 is for max
        {
            if (p1 == 0)
                return p1;

            return Math.floor(this.generateUInt() % p1);
        }

        else
        {
            if (p1 == p2)
                return p1;

            var real_min = Math.min(p1, p2);
            var real_max = Math.max(p1, p2);

            return Math.floor((this.generateUInt() % real_max) + real_min);
        }

        return 0; // Should not come here

    };

    this.next = function(p1, p2) {

        // See comments in implementation of MersenneTwister.nextInt() for details.

        if (!p1 && !p2)
            return this.nextDouble();

        else if (!p2) // If parameter 2 is unspecified, assume p1 is for max
        {
            if (p1 <= 0)
                return 0;

            return (this.nextDouble() * p1);
        }

        else
        {
            if (p1 == p2)
                return p1;

            var real_min = Math.min(p1, p2);
            var real_max = Math.max(p1, p2);


            return ((this.nextDouble() * (real_max - real_min)) + real_min);
        }

        return 0; // Should not come here

    };

    this.nextDouble = function() {

        return this.generateUInt() / (this.RAND_MAX + 1);

    };

};
