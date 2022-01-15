---
layout: post
title: Simulated Annealing in Numerical Optimization
date: "2020-06-19 13:00:00 +0000"
categories: numeric optimization
---

## Simulated annealing in numerical optimization

### A quick referesher on numerical optimization

### What is a probabilistic approach?

A probabilistic approach to numerical optimization applies elements of randomness to determine where to search next in the domain. The run time of the algorithm is dependent on the incoming random values that are presented to it. Sometimes, this will mean that it gets close to a global optimum really quickly, other times this might take longer - this is owing to the non-deterministic nature of randomness.

The longer time provided to the algorithm, the more likely it is to arrive at the global optimum - such that as the total time approaches infinity, the probability approaches 1.

Practically, we don't have infinity, go there is no guarantee we are going to reach a global optimum.

A variable probability is applied to determine how likely a weaker solution will be chosen on each new step, allowing us to search further in the domain, this reduces as a function of the remaining run time.

### What is simulated annealing?

As we mentioned above, Simulated annealing is a probabilistic method of numerical optimization.

The name comes from a metallurgy process called annealing, whereby depending upon the rate at which metal cools, the proprties of that metal can be adjusted. For example if annealed slowly, metals become more ductile, malleable, and tougher. If annealed quickly metals become harder and more brittle. 

Simulated annealing models the cooling schedule, by assigning an initial temperature, and the number of iterations available. 

The first decision when applying simulated annealing is to decide what the initial temperature will be, given that the final temperature will be 0 the time taken to cool from the initial temperature to the final temperature is the total iteration budget.

Simulated annealing, unlike first and second order methods of optimization will use all of the iterations available to find the most optimal solution.

### How does simulated anealing work?

The cooling schedule (iteration budget) has a direct affect on what weaker solutions are accepted. It's important to know the neighbours of the current state we are in, as well as the likelihood of a weaker solution being acceoted (acceptance probabilities).

On each iteration a decision is made to move to a new state from the current state. This could be a stronger state, this could be a weaker state. 

The current temperature determines the decision made, the higher the temperature the higher the probability that weaker states are accepted, as the temperature decreases the probabilities change, such that more optimal states (with lower energy) will be selected.

Earlier in the cooling schedule, where the temperature is higher, the algorithm may venture further away from the current optimum, accepting weaker solutions, as there is enough time to get back to an optimum.

In the later stages there are less iterations remaining, so the algorithm cannot venture as far away, so will accept stronger solutions towards the optimum.

### Determining an Energy Function
The goal of simulated anealing is to minimise the value of an energy function (`E(s)`). This is analogous to the merit function in numeric optimisation, and expresses what you are optimising for ("What is wished for") by minimisation.

### Neighbours of state
On each iteration small changes are made to the current state, for instance in continuous domains this might be a small change in coordinates, in combinatorial domains this might be swapping of two elements in a permuation.

With these small changes in the current state the algorithm is looking to increment towards the global optimum. Each move gives rise to a different set of neighbouring states.

Although a btter neighbour is desired, weaker neighbours are also accpeted based on probability to prevent getting stuck as this current local optimum.

### Acceptance probabilities
Acceptance probabilities determine if one of the neighbours should be accepted. This acceptance probability function takes the current state, the neigbour, the energy of the current state, the energy of the neighbour, and the current temperature.

Using these parameters a probability is caluclated as a function of the energies of the two states and the current temperature.

What does this mean?
- Lower energy states are more desirable than higher energy states
- If the neigbour state has a higher energy, and is therefore a weaker solution, the probability returned by the function should still be positive
- As the temperature descreases, this probability should tend towards 0, increasingly favouring lower energy states.

Finally randomisation based on the probability is used to determine if the current state, or the neighbour is accepted.

### Summary
- Simulated algorithm uses an initial temperature, and a final temperature (0) to a determine the iteration budget
- A current state is passed through an energy function to create a value (lower the better)
- Small changes are made to this state to create neighbours of state, and these are passed through an energy function to create a value (lower the better)
- All of this information is passed into a function that tests the values against acceptance probabilities ba

### Psuedocode

```
current_state = determine an initial state
temperature = // starting temperature for the process, how many iterations to start the annealing from?
scale = // The rate of cooling


while temperature > 0:
    temperature = temperature - scale       // Reduce the temperature
    
    // Find a neighbour (a small change to the current state)
    neighbour_state = move(current_state)   // Pick a neighbour of current_state
    
    // Determine the energiges
    current_energy = E(current_state)       // Calculate the energy of the current state
    neighbour_energy = E(neighbour_state)   // Calculate the energy of the neighbouring state

    // Apply acceptance probabilities to determine the next state
    if P(current_energy, neighbour_energy, temperature) >= random(0,1): // Use the energies from both states, and the temperature to create a probability value
      current_state = neighbour_state

// Current state contains the selected optimal
print current_state
```

### Python example
You can see an [example](https://github.com/perrygeo/simanneal/blob/master/examples/salesman.py) of this in the `simanneal` library (`pip install simanneal`)

In this example the Energy function acts as the merit function and calculates a value based on the current state: 

```python
def energy(self):
    """Calculates the length of the route."""
    e = 0
    for i in range(len(self.state)):
        e += self.distance_matrix[self.state[i-1]][self.state[i]]
    return e
```

The move function makes small changes to the current state (in the case of the travelling salesman, swapping 2 cities in the route), to determine the neighbours of state, and passes these neighbours of state through the energy function to create a value, and return the difference to the energy of the current state:

```python
def move(self):
    """Swaps two cities in the route."""
    # no efficiency gain, just proof of concept
    # demonstrates returning the delta energy (optional)
    initial_energy = self.energy()

    a = random.randint(0, len(self.state) - 1)
    b = random.randint(0, len(self.state) - 1)
    self.state[a], self.state[b] = self.state[b], self.state[a]

    return self.energy() - initial_energy
```