---
layout: post
title: Genetic Evolution in Numerical Optimization
date: "2020-08-20 13:15:00 +0000"
categories: numeric optimization
---

## Genetic evolution in numerical optimization

### Evolutionary algorithms
Evolutionary algorithms are routed in the theory of evolution, and survival of the fittest, whereby solutions that best adapt to the environment are the ones that will reproduce. These algorithms aim to find solutions with the best fitness, and those that survive are the ones to produce the next generation.

#### The underlying process
- Generate a random population
- Evaulate the fitness of the population
- Repeat the following steps until termination (time / generation limit) or the merit function is satisfied (the measure of success):
  - Select the fittest solutions for mating (parents)
  - Create new solutions by using crossover and an element of mutation of the parents (children)
  - Determine the fitness of the children
  - Replace the least fit of the population, with the children

The mating process used to generate the children uses a combination of methods inspired by nature.
The fitness function can use an approximation, if it takes too long to compute this can affect the time for running multiple generations

### Genetic algorithms
Genetic algorithms are a subset of evolutionary algorithms whereby each solution is represented as a genetic code, a most basic form of this can be expressed as a bit string `01001001`.

The mating process is achieved through a crossover operation to combine the genetic code of the parents. Mutation is applied to the children's genetic code to ensure diversity in the gene pool.

The first generation of the population is generally randomised, to remove any potential bias / assumptions.

The merit function expresses "what is wished for" and the measure of success.  

While the merit function is not satified and there are remaining generations:
  - Evaluate the fitness of every member of the population against this merit function
  - If a solution satifies the merit function, stop and return the solution
  - Randomly select a set of the most fit solutions for mating to produce new children
  - Update the population

#### Fitness
Evaluating the fitness of the solutions in the population is dependent on the problem. In genetic algorithms that have a high fitness value represent a strong solution. As most optimisation problems are looking for a global minima, it's definitely worth making the fitness the reciprocal value to be optimised, such that a lower value produces a highter fitness value. 

#### Selection
After the fitness fo the population has been evaluated solutions need to be selected to mate and mutate to derive the next generation. The fitness function and it's complexities determines whether the whole population is tested, or a sample - for instance a large domain or a complex fitness function.

There are multiple techniques that can be used for mating and producing children, genetic algorithms favour crossover and mutation. Crossover is applied to the parents to generate children, followed by probabilitistic mutation on the children for diversity.

##### Crossover
Crossover is where a portion of the genetic code of parent A, is combined with a portion of the genetic code of parent B to produce children. There are 3 approaches, single crossover where a single point is used in the genetic code, K crossover where k points are used in the genetic code to oscillate between parent A and parent B, and roulette where probability is used to select genetic code from parent A or parent B.

###### Single
In single crossover a single point is chosen between the start and end of the genetic code. The first childs' genetic code will be constructed by the code of parent A before the crossover point, and B after the crossover point. Likewise the inverse is true for the second child.

```
Parent A: 0110 0001
Parent B: 1100 1101

Crossover: 3

Child A: 0110 1101
Child B: 1101 0001
```

###### K 
In K crossover there are more than 1 crossover point, and there's an alternation between the genetic code of the parents at these points.

```
Parent A: 0110 0001
Parent B: 1100 1101

Crossover: 3, 5

Child A: 0110 1001
Child B: 1100 0101
```

###### Roulette
In roulette an element of randomness is introduced to determine what genetic code to take from each of the parents when generating the children. This process applies the following steps:

1. First the fitness population is totalled, and each member is weighted by their fitness divided by the total.
1. Two random numbers are generated for each parent, and whichever members ranges contain those numbers are the selected parents.
1. Random numbers are used again to decide how the genetic code is mixed, for each bit of the genetic code generate a number, if the number is less than 0.5 choose from parent A, else choose from parent B.

**Example**
Given a population of 3:
- `A: 0101 1111 fitness: 3`
- `B: 1001 1100 fitness: 5`
- `C: 1101 1011 fitness: 2`
- Total fitness: 10
  - `A = 3 / 10 = 0.3`
  - `B = 5 / 10 = 0.5`
  - `C = 2 / 10 = 0.2`
Generate a range for each of the parents:
- `A = [0.0, 0.3]`
- `B = [0.3, 0.8]`
- `C = [0.8, 1.0]`
  - Generate random numbers to select the parents: `0.6, 0.9 = B, C`

Mix the genetic code based on random numbers:

```
Parent B: 1001 1100
Parent C: 1101 1011
Random Numbers: 0.1, 0.9, 0.6, 0.2, 0.8, 0.3, 0.4, 0.7

Child: 1101 1101
```

##### Mutation
Mutation involves changing parts of the children independent of the parents to ensure genetic diversity.

### Disadvantages of genetic algorithms
- Repeated fitness evaluations exhaust a lot of computational time.
- Scalability with complexity is poor.
- Better solutions are only better relative to other candidate solutions.
- Genetic algorithms will converge on local optima, unlike simulated annealing that sacrifices local fitness to find better global fitness.

### Example
In this example we'll look at implementing a genetic algorithm using [DEAP](https://github.com/DEAP/deap), an evolutionary computational framework available in Python, to solve the *One Max Problem*.

#### One Max Problem
This is a basic optimization problem, the task is to find the binary string of a given length that maximizes the sum of it's digits. For example, the one max of length 5 will consider: 
- `10010 : 2`
- `01110 : 3`
- `11111 : 5`

We can see that the solution to this problem will always be a string that comprises all 1s, however the genetic algorithm doesn't know this, and has to look fo this solution using evolution. This makes it a great test case.

```python
import random

from deap import base, creator, tools

# Creator is a class factory that builds new classes at run-time
# The first parameter is the name of the new class
# The second parameter is the base class it will inherit
# Subsequent arguments are the attributes of the class
#
# Example:
#   creator.create("Student", Person, name="Matt")

# FitnessMax inherits from Fitness class of `deap.base` module
# This has an additional attribute called `weights`
# The value of weights is a tuple
creator.create("FitnessMax", base.Fitness, weights=(1.0,))

# Individual inherits from pythons list class, and contains
# FitnessMax as it's fitness attribute. This will represent an 
# individual in the population
creator.create("Individual", list, fitness=creator.FitnessMax)

# Toolbox is used to configure the genetic algorithm
# and allows us to register, and unregister content
toolbox = base.Toolbox()

# Attribute generator - to generate a random integer between 0 and 1
toolbox.register("attr_bool", random.randint, 0, 1)

# Structure initializers instatiate the individual and the population
#
# Here we are registering an individual, and an individual will be generated using
# the function initRepeat. The first argument to initRepeat is the container class, the Individual
# we created above. This container will be filled using the method attr_bool we registered above, 
# provided as a second argument, and will contain 100 integers as specified using the third argument.
#
# The individual method will return an individual initialize with the same result as us calling
# attr_bool 100 times
toolbox.register("individual", tools.initRepeat, creator.Individual, toolbox.attr_bool, 100)

# Here we are registering a population, an a population will be generated using
# the function initRepeat. The first argument to initRepeat is the container class, in this case
# Pythons native list class, and this will be filled with the individuals we registered to the toolbox
# Unlike registering the structure of individual, we don't fix the number of individuals that the population
# should contain
toolbox.register("population", tools.initRepeat, list, toolbox.individual)

# The evaulation function takes in an individual (a child of Pythons native list)
# And sum's all the integers in that list (0 or 1). The returned value from the evaluation function
# must be of a legnth equal to the number of objectives (weights) defined in FitnessMax
def evalOneMax(individual):
    return sum(individual),

# Next we should register the genetic operators. 
#
# Here we are registering the evaluation function to pass the individual into
toolbox.register("evaluate", evalOneMax)

# Here we are registering the mating process, we can use the cxTwoPoint method. This executes
# a two point crossover (k) on the input sequence of individuals.
toolbox.register("mate", tools.cxTwoPoint)

# Here we are registering the mutation process for the children. This flips the value
# of the attributes of the input value and returns the mutant. The individual is 
# expected to be a sequence of values, and stay valid after a not operator is called on them
# The indpb argument is the probability of the mutation.
toolbox.register("mutate", tools.mutFlipBit, indpb=0.05)

# Here we are registering the selection process for the best individual from `tournsize` randomly chosen
# individuals in the population
toolbox.register("select", tools.selTournament, tournsize=3)

# Here's our main method where we will execute the genetic algorithm
def main():
    # Create a population, in this case pop will be a list of 300 individuals
    pop = toolbox.population(n=300)

    # Evaluate the entire population
    fitnesses = list(map(toolbox.evaluate, pop))
    for ind, fit in zip(pop, fitnesses):
        ind.fitness.values = fit
    
    # CXPB  is the probability with which two individuals
    #       are crossed
    #
    # MUTPB is the probability for mutating an individual
    CXPB, MUTPB = 0.5, 0.2

    # Extracting all the fitnesses from the population
    fits = [ind.fitness.values[0] for ind in pop]

    # Variable keeping track of the number of generations
    generation_count = 0
    
    # Begin the evolution, while we don't have the Max One for a bit string of 100 (1111...)
    # And we are below 1000 generations
    while max(fits) < 100 and generation_count < 1000:
        # Iterate the generation
        generation_count = generation_count + 1
        print("-- Generation %i --" % generation_count)
        
        # Select the next generations individuals using the selection tournament
        offspring = toolbox.select(pop, len(pop))
        
        # Clone the selected individuals to ensure we don't use a reference to the individuals
        # but a completely independent instance. Genetic operators in the toolbox modify the objects
        # in place.
        offspring = list(map(toolbox.clone, offspring))

        # Apply crossover and mutation on the offspring
        for child1, child2 in zip(offspring[::2], offspring[1::2]):
            if random.random() < CXPB:
                # Use the mate operation we previously registered
                toolbox.mate(child1, child2)

                # Deleting the fitness marks these offspring as invalid
                # Allowing us to regenerate their fitness based on their new
                # genetic code
                del child1.fitness.values
                del child2.fitness.values

        # For each of the offspring apply some potential mutation
        for mutant in offspring:
            if random.random() < MUTPB:
                toolbox.mutate(mutant)
                # Deleting the fitness marks these offspring as invalid
                # Allowing us to regenerate their fitness based on their new
                # genetic code
                del mutant.fitness.values

        # Re-evaluate the individuals with an invalid fitness and updated genetic code
        invalid_ind = [ind for ind in offspring if not ind.fitness.valid]
        fitnesses = map(toolbox.evaluate, invalid_ind)
        for ind, fit in zip(invalid_ind, fitnesses):
            ind.fitness.values = fit

        # Replace the old population with the offspring
        # Based on the CXPB and MUTPB:
        # - A portion will potentially be the same as the previous population
        # - A portion will be the result of K (2) point crossover
        # - A portion will be the result of mutation
        pop[:] = offspring

        # Gather all the fitnesses in one list and print the stats
        fits = [ind.fitness.values[0] for ind in pop]
        
        # Population size
        length = len(pop)
        
        # Current mean (average bit sum)
        mean = sum(fits) / length

        # The standard deviation across the population
        sum2 = sum(x*x for x in fits)
        std = abs(sum2 / length - mean**2)**0.5
        
        print("  Min %s" % min(fits))
        print("  Max %s" % max(fits))
        print("  Avg %s" % mean)
        print("  Std %s" % std)

if __name__ == "__main__":
    main()
```