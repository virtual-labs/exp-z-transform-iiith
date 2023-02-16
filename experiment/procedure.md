### Procedure

#### Impulse and Step Response

This section requires selection of a system, and visualizing the impulse and step response of an LTI system by selecting "**Unit Impulse**" or "**Unit Step**". The objective of this section is to visualize the impulse and step responses of some LTI systems and identify the working of the system. Click on the "**Check**" button to visualize the plots. Steps to be done are as follows

1. Select the signal (either "**Unit Impulse**" or "**Unit Step**") in the drop down provided
2. Select the system in the drop down provided in the center box
3. Click on Check button to visualize the plot in the figure

The plot is obtained and it represents the impulse or step response of the selected system.

#### LTI Systems

This section requires selection of a system, and visualizing the working of an LTI system by selecting an input signal. The objective of this section is to visualize how various LTI systems work on different input signals. Click on the "**Check**" button to visualize the plots. Steps to be done are as follows

1. Select the signal in the drop down provided
2. Select the system in the drop down provided in the center box
3. Click on Check button to visualize the plot in the figure

The plot is obtained and it represents the output of the selected LTI system when the input to the LTI system is the selected signal.

#### LTI System Application

This section requires selection of a signal, entering a variance value for the noise to be added to the signal to make it noisy and a window size to implement a Moving Average System. The objective of this section is to implement a Moving Average System, and use it for denoising a noisy version of the signal. Click on the "**Check**" button to visualize the plots. Steps to be done are as follows

1. Select the signal in the drop down provided
2. Enter the noise variance
3. Enter the window size for the Moving Average System
4. Click on Check button to visualize the plot in the figure

The input to the filter is given as

$$
x[n] = x_{o}[n] + \eta [n]
$$

here, $x_{o}[n]$ is the original signal, $\eta [n]$ is the noise signal, which is a Gaussian distribution ($\eta \sim \mathbb{N}(0,\sigma^{2})$) with mean 0, and variance $\sigma^{2}$, which is to be entered.

The plot is obtained and it represents the output of the Moving Average System when the input to the LTI system is the selected signal with the added noise of specified noise variance.

#### Quiz 1

This section is to test the understanding, get feedback and run simulations over randomly generated inputs. The objective of this section is to test the understanding of the working of an LTI System. In the first block, we have an input signal, which is a Unit Impulse and the output of the unknown LTI system is given. In the next block, another input signal is given, to the **same** LTI system and the output is not provided. 

The task here is to identify the scale parameter (by how much will the input be scaled) and the shift parameter (by how much will the input be shifted). Click on the "**Check**" button to visualize the plot for the values entered, which would be useful for feedback. Steps to be done are as follows

1. Fill the parameters Frequency, Amplitude and Shift from Origin of the output signal

The plot is obtained and it represents the output of the unknown LTI system when the input to the LTI system is the given signal. On the same plot, the output calculated using the parameters entered is also plotted for a comparison.

The observartions tab at the bottom shows comments on whether the given parameters are correct and the output which is constructed from it, is the actual output of the given LTI System.

#### Quiz 2

This section is to test the understanding, get feedback and run simulations over randomly generated inputs. The objective of this section is to test the understanding of the working of an LTI System. In the first block, we have an input signal, which is a Unit Impulse and the output of the unknown LTI system is given. In the next block, another input signal (two scaled and shifted impulses) is given, to the **same** LTI system and the output is not provided.

It can be easily observed that the output would contain four impulses which are shifted and scaled by various amounts.

The task here is to identify the scale parameter (by how much will the input be scaled) and the shift parameter (by how much will the input be shifted) for all 4 impulses which would be obtained at the output. Click on the "**Check**" button to visualize the plot for the values entered, which would be useful for feedback. Steps to be done are as follows

1. Fill the parameters Amplitude and Shift from Origin for all 4 impulses in the output signal

The plot is obtained and it represents the output of the unknown LTI system when the input to the LTI system is the given signal. On the same plot, the output calculated using the parameters entered is also plotted for a comparison.

The observartions tab at the bottom shows comments on whether the given parameters are correct and the output which is constructed from it, is the actual output of the given LTI System.

#### Blocks Quiz

This section is to test the understanding, get feedback and run simulations over randomly generated inputs. The objective of this section is to test the understanding of the working of an LTI System. In this section, we have an input signal given and the output of an unknown LTI system is also given. Further, we assume the unknown LTI system can be implemented using three LTI systems in cascade. The task here is to identify these three systems such that the final designed system matches with the earlier provided output.

The task here is to identify the three LTI systems which when cascaded would convert the given input signal to the given output system. Scalar and Shift blocks require a number by which the signal would be scaled/shifted respectively. This is taken as an input in the text boxes right under the respective systems. Click on the "**Check**" button to visualize the plot for the values entered, which would be useful for feedback. Steps to be done are as follows

1. Select the three systems
2. If Scalar/Shift, in the text box below the corresponding LTI box, enter the value to be scaled/shifted by.

The plot is obtained and it represents the output of the unknown LTI system when the input to the LTI system is the given signal. On the same plot, the output calculated using the chosen systems and parameters entered is also plotted for a comparison.

The observartions tab at the bottom shows comments on whether the chosen LTI systems and given parameters are correct and the output which is constructed from it, is the actual output of the given LTI System.