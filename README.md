mt.js
=====

This is a implementation of [Mersenne Twister][mersenne_twister] in
JavaScript, based on a C# implementation from
[Akihilo Kramot (Takel)][original_source].

Why Another Implementation?
---------------------------

Sadly, Math.random() isn't as random as you would need it to be in certain
cases that needs a little bit more randomness.

Most of the MT implementations (including the reference) are distributed 
under a BSD license, which couldn't be used in a specific use case where
I couldn't display the necessary copyright information.

License
-------

This is distributed under the [Artistic License 2.0][artistic_license].

Usage Example
-------------

    var mt = new MersenneTwister();
    mt.init(); // You can optionally provide a seed as a parameter
    mt.nextInt(1, 100);     // Between 1 to 100
    mt.nextInt();           // Implicit means random within valid range
    mt.nextInt(100);        // One parameter means 0 to 100
    mt.next()               // Same functionality, but returns floats

[mersenne_twister]:http://www.math.sci.hiroshima-u.ac.jp/~m-mat/MT/emt.html
[original_source]:http://www.takel.jp/mt/MersenneTwister.cs
[artistic_license]:http://www.opensource.org/licenses/artistic-license-2.0
